'use client';

import Link from 'next/link';
import type { Animal, AnimalDetection } from '@/lib/types';
import { BEHAVIOR_COLORS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';

interface AnimalBehaviorCardProps {
  detection: AnimalDetection;
  animals?: Animal[];
  onAssign?: (animalId: string | null) => void;
  assigning?: boolean;
}

export default function AnimalBehaviorCard({
  detection,
  animals,
  onAssign,
  assigning,
}: AnimalBehaviorCardProps) {
  const total = detection.totalSeconds || 1;
  const eatingPct = (detection.eatingSeconds / total) * 100;
  const restingPct = (detection.restingSeconds / total) * 100;
  const movingPct = (detection.movingSeconds / total) * 100;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {detection.animal ? (
            <Link href={`/animals/${detection.animal.id}`} className="hover:text-green-700">
              {detection.animal.tag}
              {detection.animal.name ? ` · ${detection.animal.name}` : ''}
            </Link>
          ) : (
            `Vaca detectada #${detection.trackId}`
          )}
        </h4>
        <span className="text-xs text-gray-500">
          {(detection.confidence * 100).toFixed(0)}% detección
        </span>
      </div>

      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-gray-100">
        <div style={{ width: `${eatingPct}%`, backgroundColor: BEHAVIOR_COLORS.eating }} />
        <div style={{ width: `${restingPct}%`, backgroundColor: BEHAVIOR_COLORS.resting }} />
        <div style={{ width: `${movingPct}%`, backgroundColor: BEHAVIOR_COLORS.moving }} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <BehaviorStat label="Comiendo" seconds={detection.eatingSeconds} pct={eatingPct} color={BEHAVIOR_COLORS.eating} />
        <BehaviorStat label="Descansando" seconds={detection.restingSeconds} pct={restingPct} color={BEHAVIOR_COLORS.resting} />
        <BehaviorStat label="Movimiento" seconds={detection.movingSeconds} pct={movingPct} color={BEHAVIOR_COLORS.moving} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        {onAssign && animals ? (
          <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-gray-500">
            <span className="shrink-0">Asignar a:</span>
            <select
              value={detection.animalId ?? ''}
              disabled={assigning}
              onChange={(e) => onAssign(e.target.value || null)}
              className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
            >
              <option value="">Sin asignar</option>
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.tag}
                  {a.name ? ` · ${a.name}` : ''}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-xs text-gray-400">
          Observada {formatDuration(detection.totalSeconds)}
        </span>
      </div>
    </div>
  );
}

function BehaviorStat({ label, seconds, pct, color }: { label: string; seconds: number; pct: number; color: string }) {
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
