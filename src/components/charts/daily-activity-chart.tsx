'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Analysis } from '@/lib/types';
import ChartCard from './chart-card';

interface DailyActivityChartProps {
  analyses: Analysis[];
}

export default function DailyActivityChart({
  analyses,
}: DailyActivityChartProps) {
  if (!analyses || analyses.length === 0) {
    return (
      <ChartCard title="Actividad Reciente">
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          Sin datos disponibles
        </div>
      </ChartCard>
    );
  }

  const grouped: Record<string, number> = {};
  for (const a of analyses) {
    const day = format(new Date(a.startedAt), 'dd MMM', { locale: es });
    grouped[day] = (grouped[day] || 0) + 1;
  }

  const data = Object.entries(grouped).map(([date, count]) => ({
    date,
    analisis: count,
  }));

  return (
    <ChartCard title="Actividad Reciente">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAnalisis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="analisis"
              stroke="#16a34a"
              fill="url(#colorAnalisis)"
              name="Analisis"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
