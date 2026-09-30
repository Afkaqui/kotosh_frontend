'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAnimal } from '@/hooks/use-animals';
import { ANIMAL_STATUS_LABELS } from '@/lib/types';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none';

export default function AnimalForm() {
  const router = useRouter();
  const createAnimal = useCreateAnimal();

  const [form, setForm] = useState({
    tag: '',
    name: '',
    breed: '',
    sex: '',
    birthDate: '',
    weight: '',
    status: 'activo',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const animal = await createAnimal.mutateAsync({
        tag: form.tag.trim(),
        name: form.name.trim() || undefined,
        breed: form.breed.trim() || undefined,
        sex: form.sex || undefined,
        birthDate: form.birthDate ? `${form.birthDate}T12:00:00` : undefined,
        notes: form.notes.trim() || undefined,
        status: form.status,
        weight: form.weight ? Number(form.weight) : undefined,
      });
      router.push(`/animals/${animal.id}`);
    } catch {
      // shown via createAnimal.error
    }
  };

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Arete / ID *</label>
          <input
            type="text"
            required
            value={form.tag}
            onChange={(e) => update('tag', e.target.value)}
            className={inputClass}
            placeholder="Ej: V-001"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass}
            placeholder="Ej: Luna"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Raza</label>
          <input
            type="text"
            value={form.breed}
            onChange={(e) => update('breed', e.target.value)}
            className={inputClass}
            placeholder="Ej: Brown Swiss"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sexo</label>
          <select value={form.sex} onChange={(e) => update('sex', e.target.value)} className={inputClass}>
            <option value="">Seleccionar</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => update('birthDate', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Peso inicial (kg)</label>
          <input
            type="number"
            min="1"
            max="2000"
            step="0.1"
            value={form.weight}
            onChange={(e) => update('weight', e.target.value)}
            className={inputClass}
            placeholder="Ej: 420"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
        <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}>
          {Object.entries(ANIMAL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Observaciones adicionales..."
        />
      </div>

      {createAnimal.isError && <p className="text-sm text-red-600">{createAnimal.error.message}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={createAnimal.isPending || !form.tag.trim()}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {createAnimal.isPending ? 'Guardando...' : 'Registrar animal'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/animals')}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
