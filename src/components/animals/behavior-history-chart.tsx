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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BEHAVIOR_COLORS } from '@/lib/constants';
import type { BehaviorHistoryEntry } from '@/lib/types';

export default function BehaviorHistoryChart({ entries }: { entries: BehaviorHistoryEntry[] }) {
  const data = entries.map((e) => ({
    name: format(new Date(e.date), 'd MMM HH:mm', { locale: es }),
    Comiendo: e.eatingPct,
    Descansando: e.restingPct,
    'En movimiento': e.movingPct,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            allowDataOverflow
            unit="%"
            width={48}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Bar dataKey="Comiendo" stackId="a" fill={BEHAVIOR_COLORS.eating} />
          <Bar dataKey="Descansando" stackId="a" fill={BEHAVIOR_COLORS.resting} />
          <Bar dataKey="En movimiento" stackId="a" fill={BEHAVIOR_COLORS.moving} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
