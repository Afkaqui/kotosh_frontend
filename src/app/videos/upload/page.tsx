'use client';

import PageHeader from '@/components/ui/page-header';
import VideoUploadForm from '@/components/videos/video-upload-form';

export default function UploadVideoPage() {
  return (
    <div>
      <PageHeader
        title="Subir Video"
        description="Sube un video de monitoreo ganadero para su analisis"
      />
      <VideoUploadForm />
    </div>
  );
}
