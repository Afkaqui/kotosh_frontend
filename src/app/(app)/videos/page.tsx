'use client';

import Link from 'next/link';
import { Upload, Video as VideoIcon } from 'lucide-react';
import { useVideos } from '@/hooks/use-videos';
import PageHeader from '@/components/ui/page-header';
import EmptyState from '@/components/ui/empty-state';
import Skeleton from '@/components/ui/skeleton';
import VideoCard from '@/components/videos/video-card';

export default function VideosPage() {
  const { data: videos, isLoading } = useVideos();

  return (
    <div>
      <PageHeader
        title="Videos"
        description="Gestiona los videos de monitoreo ganadero"
        action={
          <Link
            href="/videos/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Upload className="h-4 w-4" />
            Subir Video
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : !videos?.length ? (
        <EmptyState
          icon={VideoIcon}
          title="No hay videos"
          description="Sube tu primer video para comenzar el análisis de comportamiento ganadero."
          action={
            <Link
              href="/videos/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              <Upload className="h-4 w-4" />
              Subir Video
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
