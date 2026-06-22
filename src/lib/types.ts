export type VideoStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

export interface Video {
  id: string;
  filename: string;
  originalName: string;
  duration: number | null;
  size: number;
  status: VideoStatus;
  uploadedAt: string;
  analyses?: Analysis[];
}

export interface Analysis {
  id: string;
  videoId: string;
  status: VideoStatus;
  fps: number | null;
  totalFrames: number | null;
  processedFrames: number | null;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  summary: AnalysisSummary | null;
  detections?: AnimalDetection[];
}

export interface AnalysisSummary {
  totalAnimals: number;
  avgEatingPct: number;
  avgRestingPct: number;
  avgMovingPct: number;
  totalDurationSeconds: number;
}

export interface AnimalDetection {
  id: string;
  trackId: number;
  label: string;
  confidence: number;
  eatingSeconds: number;
  restingSeconds: number;
  movingSeconds: number;
  totalSeconds: number;
}

export interface Animal {
  id: string;
  name: string | null;
  tag: string;
  breed: string | null;
  birthDate: string | null;
  sex: string | null;
  notes: string | null;
  photoUrl: string | null;
}

export interface DashboardMetrics {
  totalVideos: number;
  totalAnalyses: number;
  totalAnimalsDetected: number;
  avgBehavior: { eating: number; resting: number; moving: number };
  recentAnalyses: Analysis[];
}
