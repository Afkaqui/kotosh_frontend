'use client';

import Link from 'next/link';
import { Plus, PawPrint } from 'lucide-react';
import { useAnimals } from '@/hooks/use-animals';
import PageHeader from '@/components/ui/page-header';
import EmptyState from '@/components/ui/empty-state';
import Skeleton from '@/components/ui/skeleton';
import AnimalTable from '@/components/animals/animal-table';
import { useAuth } from '@/providers/auth-provider';

export default function AnimalsPage() {
  const { data: animals, isLoading } = useAnimals();
  const { can } = useAuth();
  const canEdit = can('ADMIN', 'ENCARGADO');

  return (
    <div>
      <PageHeader
        title="Animales"
        description="Registro del hato: identificación, peso y estado"
        action={
          canEdit && <Link
            href="/animals/new"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Registrar Animal
          </Link>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : !animals?.length ? (
        <EmptyState
          icon={PawPrint}
          title="No hay animales registrados"
          description="Registra los animales para asociarlos con las detecciones del análisis."
          action={
            canEdit && <Link
              href="/animals/new"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Registrar Animal
            </Link>
          }
        />
      ) : (
        <AnimalTable animals={animals} />
      )}
    </div>
  );
}
