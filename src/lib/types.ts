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
  classifierMode?: string;
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
  animalId?: string | null;
  animal?: { id: string; tag: string; name: string | null } | null;
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
  weight: number | null;
  status: string | null;
  weightRecords?: WeightRecord[];
}

export interface WeightRecord {
  id: string;
  animalId: string;
  weight: number;
  date: string;
  notes: string | null;
}

export interface AnimalStats {
  totalAnimals: number;
  activeAnimals: number;
  inactiveAnimals: number;
  averageWeight: number;
  byStatus: { status: string; count: number }[];
  lastWeighingDate: string | null;
}

export interface BehaviorHistoryEntry {
  detectionId: string;
  analysisId: string;
  date: string;
  videoName: string;
  trackId: number;
  eatingSeconds: number;
  restingSeconds: number;
  movingSeconds: number;
  totalSeconds: number;
  eatingPct: number;
  restingPct: number;
  movingPct: number;
}

export const ANIMAL_STATUS_LABELS: Record<string, string> = {
  activo: 'Activo',
  en_tratamiento: 'En tratamiento',
  vendido: 'Vendido',
  baja: 'Baja',
};

export type AnimalInput = {
  tag: string;
  name?: string;
  breed?: string;
  sex?: string;
  birthDate?: string;
  notes?: string;
  status?: string;
  weight?: number;
};

export interface DashboardMetrics {
  totalVideos: number;
  totalAnalyses: number;
  totalAnimalsDetected: number;
  avgBehavior: { eating: number; resting: number; moving: number };
  recentAnalyses: Analysis[];
}
