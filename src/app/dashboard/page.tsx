'use client';

import { Video, BarChart3, PawPrint, Activity } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/use-metrics';
import PageHeader from '@/components/ui/page-header';
import StatCard from '@/components/ui/stat-card';
import BehaviorPieChart from '@/components/charts/behavior-pie-chart';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general de la plataforma KotoshTech"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Video}
          label="Videos"
          value={metrics?.totalVideos ?? 0}
        />
        <StatCard
          icon={BarChart3}
          label="Analisis"
          value={metrics?.totalAnalyses ?? 0}
        />
        <StatCard
          icon={PawPrint}
          label="Animales Detectados"
          value={metrics?.totalAnimalsDetected ?? 0}
        />
        <StatCard
          icon={Activity}
          label="Comportamiento Promedio"
          value={
            metrics?.avgBehavior
              ? `${metrics.avgBehavior.eating.toFixed(0)}% comiendo`
              : '-'
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BehaviorPieChart
          eating={metrics?.avgBehavior?.eating ?? 0}
          resting={metrics?.avgBehavior?.resting ?? 0}
          moving={metrics?.avgBehavior?.moving ?? 0}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Analisis Recientes
          </h3>
          {!metrics?.recentAnalyses?.length ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No hay analisis recientes
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.recentAnalyses.slice(0, 5).map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/analysis/${analysis.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      Analisis #{analysis.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(analysis.startedAt)}
                    </p>
                  </div>
                  <Badge status={analysis.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
