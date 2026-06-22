'use client';

import Link from 'next/link';
import { Video, Play, Trash2 } from 'lucide-react';
import type { Video as VideoType } from '@/lib/types';
import Badge from '@/components/ui/badge';
import { formatDate, formatFileSize, formatDuration } from '@/lib/utils';
import { useDeleteVideo, useAnalyzeVideo } from '@/hooks/use-videos';

interface VideoCardProps {
  video: VideoType;
}

export default function VideoCard({ video }: VideoCardProps) {
  const deleteVideo = useDeleteVideo();
  const analyzeVideo = useAnalyzeVideo();

  const latestAnalysis = video.analyses?.[0];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-32 items-center justify-center bg-gray-100">
        <Video className="h-10 w-10 text-gray-300" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {video.originalName}
          </h3>
          <Badge status={video.status} />
        </div>

        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>{formatFileSize(video.size)}</p>
          {video.duration && <p>Duracion: {formatDuration(video.duration)}</p>}
          <p>{formatDate(video.uploadedAt)}</p>
        </div>

        <div className="mt-3 flex gap-2">
          {latestAnalysis ? (
            <Link
              href={`/analysis/${latestAnalysis.id}`}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Ver Analisis
            </Link>
          ) : (
            <button
              onClick={() => analyzeVideo.mutate(video.id)}
              disabled={analyzeVideo.isPending || video.status === 'PROCESSING'}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              Analizar
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Eliminar este video?')) deleteVideo.mutate(video.id);
            }}
            disabled={deleteVideo.isPending}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-gray-400 hover:border-red-200 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
