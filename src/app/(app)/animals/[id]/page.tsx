'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Scale, Trash2, TrendingUp, Activity } from 'lucide-react';
import {
  useAnimal,
  useAnimalBehavior,
  useAddWeight,
  useDeleteWeight,
  useDeleteAnimal,
  useUpdateAnimal,
} from '@/hooks/use-animals';
import { useAuth } from '@/providers/auth-provider';
import { ANIMAL_STATUS_LABELS, type Animal } from '@/lib/types';
import { ageFrom, formatDate, formatDay, formatDuration, toDateInput, todayInput } from '@/lib/utils';
import Skeleton from '@/components/ui/skeleton';
import StatusPill from '@/components/animals/status-pill';
import WeightChart, { weightSummary } from '@/components/animals/weight-chart';
import BehaviorHistoryChart from '@/components/animals/behavior-history-chart';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none';

export default function AnimalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { can } = useAuth();
  const canEdit = can('ADMIN', 'ENCARGADO');
  const { data: animal, isLoading, error } = useAnimal(id);
  const { data: behavior } = useAnimalBehavior(id);
  const deleteAnimal = useDeleteAnimal();
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">{error?.message ?? 'Animal no encontrado'}</p>
        <Link href="/animals" className="mt-2 inline-block text-sm text-green-600 hover:underline">
          Volver a animales
        </Link>
      </div>
    );
  }

  const records = animal.weightRecords ?? [];
  const summary = weightSummary(records);
  const age = ageFrom(animal.birthDate);

  return (
    <div className="space-y-6">
      <Link href="/animals" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Volver a animales
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{animal.tag}</h1>
            <StatusPill status={animal.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {[animal.name, animal.breed, animal.sex === 'F' ? 'Hembra' : animal.sex === 'M' ? 'Macho' : null, age]
              .filter(Boolean)
              .join(' · ') || 'Sin datos adicionales'}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4" />
              {editing ? 'Cerrar edición' : 'Editar'}
            </button>
            <button
              onClick={async () => {
                if (!confirm(`¿Eliminar a ${animal.tag}? Se borrará su historial de peso.`)) return;
                await deleteAnimal.mutateAsync(animal.id);
                router.push('/animals');
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-red-600 hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {editing && <EditAnimalForm animal={animal} onDone={() => setEditing(false)} />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={Scale} label="Peso actual" value={summary ? `${summary.current.toFixed(1)} kg` : '-'} />
        <Metric
          icon={TrendingUp}
          label="Ganancia total"
          value={summary && summary.count > 1 ? `${summary.gain >= 0 ? '+' : ''}${summary.gain.toFixed(1)} kg` : '-'}
          hint={summary && summary.count > 1 ? `en ${summary.days} días` : undefined}
        />
        <Metric
          icon={TrendingUp}
          label="Ganancia diaria prom."
          value={summary?.adg != null ? `${(summary.adg * 1000).toFixed(0)} g/día` : '-'}
        />
        <Metric icon={Activity} label="Análisis asignados" value={String(behavior?.length ?? 0)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Curva de peso</h2>
          <WeightChart records={records} />
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Registrar pesaje</h2>
          <WeightForm animalId={animal.id} />
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-6 py-4 text-base font-semibold text-gray-900">
          Historial de pesajes
        </h2>
        <WeightTable animalId={animal.id} records={records} canDelete={canEdit} />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Comportamiento observado</h2>
        <p className="mb-4 mt-0.5 text-sm text-gray-500">
          Proporción de tiempo comiendo, descansando y en movimiento en cada video donde se identificó a este animal.
        </p>
        {!behavior?.length ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-400">
            Aún no hay detecciones asignadas. Desde el detalle de un análisis, asigna cada vaca detectada a su arete.
          </p>
        ) : (
          <>
            <BehaviorHistoryChart entries={behavior} />
            <div className="mt-4 divide-y divide-gray-100">
              {[...behavior].reverse().map((b) => (
                <Link
                  key={b.detectionId}
                  href={`/analysis/${b.analysisId}`}
                  className="flex items-center justify-between py-2.5 text-sm hover:bg-gray-50"
                >
                  <span className="truncate text-gray-700">
                    {formatDate(b.date)} · {b.videoName}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500">
                    {b.eatingPct}% / {b.restingPct}% / {b.movingPct}% · {formatDuration(b.totalSeconds)}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {animal.notes && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Notas</h2>
          <p className="whitespace-pre-line text-sm text-gray-600">{animal.notes}</p>
        </section>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums text-gray-900">{value}</p>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function WeightForm({ animalId }: { animalId: string }) {
  const addWeight = useAddWeight(animalId);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayInput());
  const [notes, setNotes] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await addWeight.mutateAsync({
      weight: Number(weight),
      date: `${date}T12:00:00`,
      notes: notes.trim() || undefined,
    });
    setWeight('');
    setNotes('');
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Peso (kg) *</label>
        <input
          type="number"
          required
          min="1"
          max="2000"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className={inputClass}
          placeholder="Ej: 452.5"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Fecha *</label>
        <input
          type="date"
          required
          max={todayInput()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Observación</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
          placeholder="Opcional"
        />
      </div>
      {addWeight.isError && <p className="text-sm text-red-600">{addWeight.error.message}</p>}
      <button
        type="submit"
        disabled={addWeight.isPending || !weight}
        className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {addWeight.isPending ? 'Guardando...' : 'Guardar pesaje'}
      </button>
    </form>
  );
}

function WeightTable({
  animalId,
  records,
  canDelete,
}: {
  animalId: string;
  records: NonNullable<Animal['weightRecords']>;
  canDelete: boolean;
}) {
  const deleteWeight = useDeleteWeight(animalId);
  const sorted = [...records].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (sorted.length === 0) {
    return <p className="px-6 py-8 text-center text-sm text-gray-400">Sin pesajes registrados</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-2">Fecha</th>
            <th className="px-6 py-2 text-right">Peso (kg)</th>
            <th className="px-6 py-2 text-right">Variación</th>
            <th className="px-6 py-2">Observación</th>
            {canDelete && <th className="px-6 py-2" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((r, i) => {
            const prev = sorted[i + 1];
            const diff = prev ? r.weight - prev.weight : null;
            return (
              <tr key={r.id}>
                <td className="px-6 py-2.5 text-gray-700">{formatDay(r.date)}</td>
                <td className="px-6 py-2.5 text-right font-medium tabular-nums text-gray-900">
                  {r.weight.toFixed(1)}
                </td>
                <td
                  className={`px-6 py-2.5 text-right tabular-nums ${
                    diff == null ? 'text-gray-400' : diff >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {diff == null ? '-' : `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`}
                </td>
                <td className="px-6 py-2.5 text-gray-500">{r.notes || '-'}</td>
                {canDelete && (
                  <td className="px-6 py-2.5 text-right">
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este registro de peso?')) deleteWeight.mutate(r.id);
                      }}
                      className="rounded p-1 text-gray-400 hover:text-red-500"
                      title="Eliminar registro"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditAnimalForm({ animal, onDone }: { animal: Animal; onDone: () => void }) {
  const update = useUpdateAnimal(animal.id);
  const [form, setForm] = useState({
    tag: animal.tag,
    name: animal.name ?? '',
    breed: animal.breed ?? '',
    sex: animal.sex ?? '',
    birthDate: toDateInput(animal.birthDate),
    status: animal.status ?? 'activo',
    notes: animal.notes ?? '',
  });
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await update.mutateAsync({
      tag: form.tag.trim(),
      name: form.name.trim(),
      breed: form.breed.trim(),
      sex: form.sex || undefined,
      birthDate: form.birthDate ? `${form.birthDate}T12:00:00` : undefined,
      status: form.status,
      notes: form.notes.trim(),
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Arete / ID">
          <input required value={form.tag} onChange={(e) => set('tag', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Nombre">
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Raza">
          <input value={form.breed} onChange={(e) => set('breed', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Sexo">
          <select value={form.sex} onChange={(e) => set('sex', e.target.value)} className={inputClass}>
            <option value="">Sin especificar</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </Field>
        <Field label="Fecha de nacimiento">
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Estado">
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
            {Object.entries(ANIMAL_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notas" className="mt-4">
        <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={inputClass} />
      </Field>
      {update.isError && <p className="mt-2 text-sm text-red-600">{update.error.message}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {update.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
