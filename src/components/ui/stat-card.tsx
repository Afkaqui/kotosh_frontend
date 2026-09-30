'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { animate, motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
  animateValue?: boolean;
}

// Animates the leading number of values like 12, "475.5 kg" or "2 / 3"; other text is shown as-is.
function AnimatedValue({ value }: { value: string | number }) {
  const text = String(value);
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const decimals = match?.[1].split('.')[1]?.length ?? 0;
  const [shown, setShown] = useState(target ?? 0);

  useEffect(() => {
    if (target == null) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [target]);

  if (!match) return <>{text}</>;
  return (
    <>
      {shown.toFixed(decimals)}
      {match[2]}
    </>
  );
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  className,
  animateValue = true,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-cyan-600 shadow-md shadow-green-600/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold tabular-nums text-gray-900">
            {animateValue ? <AnimatedValue value={value} /> : value}
          </p>
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
    </motion.div>
  );
}
