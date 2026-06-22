'use client';

import { Trash2 } from 'lucide-react';
import type { Animal } from '@/lib/types';
import { useDeleteAnimal } from '@/hooks/use-animals';
import { formatDate } from '@/lib/utils';

interface AnimalTableProps {
  animals: Animal[];
}

export default function AnimalTable({ animals }: AnimalTableProps) {
  const deleteAnimal = useDeleteAnimal();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Raza</th>
              <th className="px-4 py-3">Sexo</th>
              <th className="px-4 py-3">Nacimiento</th>
              <th className="px-4 py-3">Notas</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {animals.map((animal) => (
              <tr key={animal.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {animal.tag}
                </td>
                <td className="px-4 py-3 text-gray-700">{animal.name || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{animal.breed || '-'}</td>
                <td className="px-4 py-3 text-gray-700">
                  {animal.sex === 'M' ? 'Macho' : animal.sex === 'F' ? 'Hembra' : '-'}
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDate(animal.birthDate)}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-gray-500">
                  {animal.notes || '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      if (confirm(`Eliminar animal ${animal.tag}?`))
                        deleteAnimal.mutate(animal.id);
                    }}
                    disabled={deleteAnimal.isPending}
                    className="rounded p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
