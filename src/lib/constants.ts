export const BEHAVIOR_COLORS = {
  eating: '#22c55e',
  resting: '#3b82f6',
  moving: '#f59e0b',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ERROR: 'bg-red-100 text-red-700',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completado',
  ERROR: 'Error',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Videos', href: '/videos', icon: 'Video' },
  { label: 'Animales', href: '/animals', icon: 'PawPrint' },
] as const;
