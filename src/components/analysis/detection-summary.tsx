import { PawPrint, Utensils, Moon, Footprints } from 'lucide-react';
import type { AnalysisSummary } from '@/lib/types';

interface DetectionSummaryProps {
  summary: AnalysisSummary;
}

export default function DetectionSummary({ summary }: DetectionSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <SummaryCard
        icon={PawPrint}
        label="Animales"
        value={summary.totalAnimals}
        color="text-gray-700"
        bg="bg-gray-100"
      />
      <SummaryCard
        icon={Utensils}
        label="Comiendo"
        value={`${summary.avgEatingPct.toFixed(1)}%`}
        color="text-green-700"
        bg="bg-green-100"
      />
      <SummaryCard
        icon={Moon}
        label="Descansando"
        value={`${summary.avgRestingPct.toFixed(1)}%`}
        color="text-blue-700"
        bg="bg-blue-100"
      />
      <SummaryCard
        icon={Footprints}
        label="En movimiento"
        value={`${summary.avgMovingPct.toFixed(1)}%`}
        color="text-amber-700"
        bg="bg-amber-100"
      />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className={`inline-flex rounded-lg p-2 ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
