'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Video, BarChart3, PawPrint, Activity, Scale, Stethoscope, CalendarDays, Upload } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/use-metrics';
import { useAnimalStats } from '@/hooks/use-animals';
import { useAuth } from '@/providers/auth-provider';
import StatCard from '@/components/ui/stat-card';
import BehaviorPieChart from '@/components/charts/behavior-pie-chart';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { formatDate, formatDay } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const { data: herd } = useAnimalStats();
  const { user } = useAuth();

  if (isLoading) return <DashboardSkeleton />;

  const inTreatment = herd?.byStatus.find((s) => s.status === 'en_tratamiento')?.count ?? 0;

  const firstName = user?.name.split(' ')[0] ?? '';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 overflow-hidden rounded-3xl bg-gray-900 shadow-xl"
      >
        <Image src="/img/kotosh-corrales.webp" alt="Corrales del Centro de Producción Kotosh" fill preload sizes="(min-width: 1024px) 75vw, 100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/75 to-transparent" />
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium capitalize text-green-200">
              {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
              {greeting}{firstName ? `, ${firstName}` : ''}
            </h1>
            <p className="mt-1 text-sm text-green-100/90">Estado del Centro de Producción Kotosh</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/animals" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-800 shadow transition-transform hover:-translate-y-0.5">
              <Scale className="h-4 w-4" /> Registrar pesaje
            </Link>
            <Link href="/videos/upload" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-transform hover:-translate-y-0.5">
              <Upload className="h-4 w-4" /> Subir video
            </Link>
          </div>
        </div>
      </motion.section>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Hato</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={PawPrint} label="Animales activos" value={`${herd?.activeAnimals ?? 0} / ${herd?.totalAnimals ?? 0}`} />
        <StatCard
          icon={Scale}
          label="Peso promedio (activos)"
          value={herd?.averageWeight ? `${herd.averageWeight.toFixed(1)} kg` : '-'}
        />
        <StatCard icon={Stethoscope} label="En tratamiento" value={inTreatment} />
        <StatCard icon={CalendarDays} label="Último pesaje" value={formatDay(herd?.lastWeighingDate)} animateValue={false} />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Visión artificial</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Video}
          label="Videos"
          value={metrics?.totalVideos ?? 0}
        />
        <StatCard
          icon={BarChart3}
          label="Análisis"
          value={metrics?.totalAnalyses ?? 0}
        />
        <StatCard
          icon={PawPrint}
          label="Vacas detectadas"
          value={metrics?.totalAnimalsDetected ?? 0}
        />
        <StatCard
          icon={Activity}
          label="Comportamiento promedio"
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
            Análisis recientes
          </h3>
          {!metrics?.recentAnalyses?.length ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No hay análisis recientes
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
                      Análisis #{analysis.id.slice(0, 8)}
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
