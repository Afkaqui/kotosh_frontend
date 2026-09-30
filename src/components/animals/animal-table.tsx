'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { Animal } from '@/lib/types';
import { formatDay } from '@/lib/utils';
import StatusPill from './status-pill';

interface AnimalTableProps {
  animals: Animal[];
}

export default function AnimalTable({ animals }: AnimalTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Arete</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Raza</th>
              <th className="px-4 py-3">Sexo</th>
              <th className="px-4 py-3 text-right">Peso (kg)</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Nacimiento</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {animals.map((animal) => (
              <tr
                key={animal.id}
                onClick={() => router.push(`/animals/${animal.id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  <Link href={`/animals/${animal.id}`} onClick={(e) => e.stopPropagation()}>
                    {animal.tag}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{animal.name || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{animal.breed || '-'}</td>
                <td className="px-4 py-3 text-gray-700">
                  {animal.sex === 'M' ? 'Macho' : animal.sex === 'F' ? 'Hembra' : '-'}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                  {animal.weight != null ? animal.weight.toFixed(1) : '-'}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={animal.status} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDay(animal.birthDate)}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
