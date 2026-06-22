'use client';

import PageHeader from '@/components/ui/page-header';
import AnimalForm from '@/components/animals/animal-form';

export default function NewAnimalPage() {
  return (
    <div>
      <PageHeader
        title="Registrar Animal"
        description="Agrega un nuevo animal al registro de monitoreo"
      />
      <AnimalForm />
    </div>
  );
}
