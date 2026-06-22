'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAnimal } from '@/hooks/use-animals';

export default function AnimalForm() {
  const router = useRouter();
  const createAnimal = useCreateAnimal();

  const [form, setForm] = useState({
    tag: '',
    name: '',
    breed: '',
    sex: '',
    birthDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAnimal.mutateAsync({
        tag: form.tag,
        name: form.name || null,
        breed: form.breed || null,
        sex: form.sex || null,
        birthDate: form.birthDate || null,
        notes: form.notes || null,
        photoUrl: null,
      });
      router.push('/animals');
    } catch {
      // error handled by mutation
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tag (identificador) *
        </label>
        <input
          type="text"
          required
          value={form.tag}
          onChange={(e) => update('tag', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          placeholder="Ej: V-001"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          placeholder="Ej: Luna"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Raza</label>
          <input
            type="text"
            value={form.breed}
            onChange={(e) => update('breed', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="Ej: Holstein"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sexo</label>
          <select
            value={form.sex}
            onChange={(e) => update('sex', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Seleccionar</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => update('birthDate', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          placeholder="Observaciones adicionales..."
        />
      </div>

      {createAnimal.isError && (
        <p className="text-sm text-red-600">{createAnimal.error.message}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={createAnimal.isPending || !form.tag}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {createAnimal.isPending ? 'Guardando...' : 'Registrar Animal'}
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
