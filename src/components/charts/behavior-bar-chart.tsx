'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BEHAVIOR_COLORS } from '@/lib/constants';
import type { AnimalDetection } from '@/lib/types';
import ChartCard from './chart-card';

interface BehaviorBarChartProps {
  detections: AnimalDetection[];
}

export default function BehaviorBarChart({
  detections,
}: BehaviorBarChartProps) {
  if (!detections || detections.length === 0) {
    return (
      <ChartCard title="Comportamiento por Animal">
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          Sin datos disponibles
        </div>
      </ChartCard>
    );
  }

  const data = detections.map((d) => ({
    name: d.animal?.tag ?? `Vaca #${d.trackId}`,
    Comiendo: Math.round((d.eatingSeconds / d.totalSeconds) * 100) || 0,
    Descansando: Math.round((d.restingSeconds / d.totalSeconds) * 100) || 0,
    'En movimiento':
      Math.round((d.movingSeconds / d.totalSeconds) * 100) || 0,
  }));

  return (
    <ChartCard title="Comportamiento por Animal">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar
              dataKey="Comiendo"
              stackId="a"
              fill={BEHAVIOR_COLORS.eating}
            />
            <Bar
              dataKey="Descansando"
              stackId="a"
              fill={BEHAVIOR_COLORS.resting}
            />
            <Bar
              dataKey="En movimiento"
              stackId="a"
              fill={BEHAVIOR_COLORS.moving}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
