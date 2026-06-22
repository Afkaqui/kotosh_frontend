import clsx from 'clsx';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import type { VideoStatus } from '@/lib/types';

interface BadgeProps {
  status: VideoStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
