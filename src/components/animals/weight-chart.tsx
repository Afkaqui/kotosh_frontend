'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WeightRecord } from '@/lib/types';

export function weightSummary(records: WeightRecord[]) {
  if (records.length === 0) return null;
  const sorted = [...records].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const days = (+new Date(last.date) - +new Date(first.date)) / 86_400_000;
  const gain = last.weight - first.weight;
  return {
    current: last.weight,
    gain,
    // Average daily gain (ganancia diaria promedio), the standard growth indicator.
    adg: days >= 1 ? gain / days : null,
    days: Math.round(days),
    count: sorted.length,
  };
}

export default function WeightChart({ records }: { records: WeightRecord[] }) {
  if (records.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-gray-50 text-center text-sm text-gray-400">
        {records.length === 0
          ? 'Sin pesajes registrados'
          : 'Registra al menos dos pesajes para ver la curva de crecimiento'}
      </div>
    );
  }

  const data = [...records]
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .map((r) => ({ ts: +new Date(r.date), peso: r.weight }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(v) => format(new Date(v), 'd MMM', { locale: es })}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={['auto', 'auto']}
            unit=" kg"
            width={64}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            labelFormatter={(v) => format(new Date(Number(v)), "d 'de' MMM yyyy", { locale: es })}
            formatter={(v) => [`${Number(v).toFixed(1)} kg`, 'Peso']}
          />
          <Line type="monotone" dataKey="peso" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
