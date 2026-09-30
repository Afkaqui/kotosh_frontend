import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  try {
    return format(new Date(isoString), "d 'de' MMM yyyy, HH:mm", {
      locale: es,
    });
  } catch {
    return '-';
  }
}

// Calendar dates are sent as local noon, so the local date is stable in any American timezone.
export function formatDay(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return Number.isNaN(+d) ? '-' : format(d, "d 'de' MMM yyyy", { locale: es });
}

export function toDateInput(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayInput(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function ageFrom(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const birth = new Date(isoString);
  const months =
    (new Date().getFullYear() - birth.getFullYear()) * 12 + new Date().getMonth() - birth.getMonth();
  if (months < 0) return null;
  if (months < 24) return `${months} meses`;
  return `${Math.floor(months / 12)} años ${months % 12 ? `${months % 12} m` : ''}`.trim();
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
