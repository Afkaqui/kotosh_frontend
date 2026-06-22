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
