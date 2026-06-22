'use client';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BEHAVIOR_COLORS } from '@/lib/constants';
import ChartCard from './chart-card';

interface BehaviorPieChartProps {
  eating: number;
  resting: number;
  moving: number;
}

export default function BehaviorPieChart({
  eating,
  resting,
  moving,
}: BehaviorPieChartProps) {
  const data = [
    { name: 'Comiendo', value: eating, color: BEHAVIOR_COLORS.eating },
    { name: 'Descansando', value: resting, color: BEHAVIOR_COLORS.resting },
    { name: 'En movimiento', value: moving, color: BEHAVIOR_COLORS.moving },
  ];

  const total = eating + resting + moving;

  if (total === 0) {
    return (
      <ChartCard title="Distribucion de Comportamiento">
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          Sin datos disponibles
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Distribucion de Comportamiento">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              dataKey="value"
              paddingAngle={2}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
