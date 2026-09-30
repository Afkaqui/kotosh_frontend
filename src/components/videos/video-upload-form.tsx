'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, FileVideo, CheckCircle2 } from 'lucide-react';
import { useUploadVideo, useAnalyzeVideo } from '@/hooks/use-videos';
import { formatFileSize } from '@/lib/utils';

// Cloudflare's proxy rejects request bodies over 100 MB.
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export default function VideoUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const uploadVideo = useUploadVideo();
  const analyzeVideo = useAnalyzeVideo();

  const [fileError, setFileError] = useState('');

  const handleFile = useCallback((f: File) => {
    setFileError('');
    if (!f.type.startsWith('video/')) {
      setFileError('El archivo no es un video.');
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setFileError(
        `El video pesa ${formatFileSize(f.size)}; el máximo es 100 MB. Recórtalo a unos minutos o expórtalo en 720p.`,
      );
      return;
    }
    setFile(f);
    setProgress(0);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;
    try {
      const video = await uploadVideo.mutateAsync({
        file,
        onProgress: setProgress,
      });
      analyzeVideo.mutate(video.id);
      router.push('/videos');
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          Arrastra un video aquí o haz clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-gray-500">MP4, AVI, MOV — máx. 100 MB y 10 minutos</p>
      </div>

      {fileError && <p className="mt-3 text-sm text-red-600">{fileError}</p>}

      {file && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <FileVideo className="h-8 w-8 text-green-600" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setProgress(0);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {uploadVideo.isPending && (
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{progress}% subido</p>
            </div>
          )}

          {uploadVideo.isSuccess && (
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm">Video subido y análisis iniciado</p>
            </div>
          )}

          {uploadVideo.isError && (
            <p className="mt-3 text-sm text-red-600">
              Error: {uploadVideo.error.message}
            </p>
          )}

          {!uploadVideo.isPending && !uploadVideo.isSuccess && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Subir y analizar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
