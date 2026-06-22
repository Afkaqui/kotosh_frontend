import type { AnimalDetection } from '@/lib/types';
import { BEHAVIOR_COLORS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';

interface AnimalBehaviorCardProps {
  detection: AnimalDetection;
}

export default function AnimalBehaviorCard({ detection }: AnimalBehaviorCardProps) {
  const total = detection.totalSeconds || 1;
  const eatingPct = (detection.eatingSeconds / total) * 100;
  const restingPct = (detection.restingSeconds / total) * 100;
  const movingPct = (detection.movingSeconds / total) * 100;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          {detection.label || `Animal #${detection.trackId}`}
        </h4>
        <span className="text-xs text-gray-500">
          {(detection.confidence * 100).toFixed(0)}% confianza
        </span>
      </div>

      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        <div
          style={{ width: `${eatingPct}%`, backgroundColor: BEHAVIOR_COLORS.eating }}
          className="transition-all"
        />
        <div
          style={{ width: `${restingPct}%`, backgroundColor: BEHAVIOR_COLORS.resting }}
          className="transition-all"
        />
        <div
          style={{ width: `${movingPct}%`, backgroundColor: BEHAVIOR_COLORS.moving }}
          className="transition-all"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <BehaviorStat
          label="Comiendo"
          seconds={detection.eatingSeconds}
          pct={eatingPct}
          color={BEHAVIOR_COLORS.eating}
        />
        <BehaviorStat
          label="Descansando"
          seconds={detection.restingSeconds}
          pct={restingPct}
          color={BEHAVIOR_COLORS.resting}
        />
        <BehaviorStat
          label="Movimiento"
          seconds={detection.movingSeconds}
          pct={movingPct}
          color={BEHAVIOR_COLORS.moving}
        />
      </div>

      <p className="mt-3 text-right text-xs text-gray-400">
        Total: {formatDuration(detection.totalSeconds)}
      </p>
    </div>
  );
}

function BehaviorStat({
  label,
  seconds,
  pct,
  color,
}: {
  label: string;
  seconds: number;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900">{pct.toFixed(0)}%</p>
      <p className="text-xs text-gray-400">{formatDuration(seconds)}</p>
    </div>
  );
}
