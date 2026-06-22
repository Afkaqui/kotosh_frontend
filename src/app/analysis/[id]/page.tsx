'use client';

import { use } from 'react';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAnalysis } from '@/hooks/use-analyses';
import PageHeader from '@/components/ui/page-header';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import BehaviorBarChart from '@/components/charts/behavior-bar-chart';
import DetectionSummary from '@/components/analysis/detection-summary';
import AnimalBehaviorCard from '@/components/analysis/animal-behavior-card';
import { formatDate, formatDuration } from '@/lib/utils';

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: analysis, isLoading } = useAnalysis(id);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Analisis no encontrado</p>
        <Link href="/videos" className="mt-2 text-sm text-green-600 hover:underline">
          Volver a videos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/videos"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a videos
      </Link>

      <PageHeader
        title={`Analisis #${analysis.id.slice(0, 8)}`}
        action={<Badge status={analysis.status} />}
      />

      {analysis.status === 'PROCESSING' && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">Procesando video...</p>
            <p className="text-xs text-blue-600">
              {analysis.processedFrames ?? 0} / {analysis.totalFrames ?? '?'} frames
            </p>
          </div>
        </div>
      )}

      {analysis.status === 'ERROR' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">Error en el analisis</p>
          <p className="text-xs text-red-600">{analysis.errorMessage || 'Error desconocido'}</p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Inicio</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(analysis.startedAt)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Fin</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(analysis.completedAt)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">FPS</p>
          <p className="text-sm font-medium text-gray-900">{analysis.fps ?? '-'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Frames</p>
          <p className="text-sm font-medium text-gray-900">
            {analysis.processedFrames ?? '-'} / {analysis.totalFrames ?? '-'}
          </p>
        </div>
      </div>

      {analysis.summary && <DetectionSummary summary={analysis.summary} />}

      {analysis.detections && analysis.detections.length > 0 && (
        <>
          <div className="mt-6">
            <BehaviorBarChart detections={analysis.detections} />
          </div>

          <div className="mt-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Detalle por Animal
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {analysis.detections.map((detection) => (
                <AnimalBehaviorCard key={detection.id} detection={detection} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
