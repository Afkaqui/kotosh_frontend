import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
          <Icon className="h-5 w-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <p
          className={clsx(
            'mt-2 text-xs font-medium',
            changeType === 'positive' && 'text-green-600',
            changeType === 'negative' && 'text-red-600',
            changeType === 'neutral' && 'text-gray-500'
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
