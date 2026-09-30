import clsx from 'clsx';
import { ANIMAL_STATUS_LABELS } from '@/lib/types';

const STYLES: Record<string, string> = {
  activo: 'bg-green-100 text-green-700',
  en_tratamiento: 'bg-amber-100 text-amber-700',
  vendido: 'bg-blue-100 text-blue-700',
  baja: 'bg-gray-100 text-gray-600',
};

export default function StatusPill({ status }: { status: string | null }) {
  const key = status ?? 'activo';
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        STYLES[key] ?? STYLES.baja,
      )}
    >
      {ANIMAL_STATUS_LABELS[key] ?? key}
    </span>
  );
}
