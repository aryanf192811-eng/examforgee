/**
 * ExamForge Utility Functions
 * Shared helpers used across the application.
 */

/**
 * Combines CSS class names, filtering out falsy values.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number with commas for display.
 * Null-coalesces to 0 by default.
 */
export function formatNumber(value: number | null | undefined, fallback = 0): string {
  return (value ?? fallback).toLocaleString();
}

/**
 * Formats a percentage value for display.
 * Null-coalesces to 0 by default.
 */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  return `${(value ?? 0).toFixed(decimals)}%`;
}

/**
 * Formats minutes into a human readable duration string.
 */
export function formatDuration(minutes: number | null | undefined): string {
  const m = minutes ?? 0;
  if (m < 60) return `${m}m`;
  const hours = Math.floor(m / 60);
  const remaining = m % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

/**
 * Formats an ISO date string into a readable format.
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Formats a relative time ago string (e.g., "2 hours ago").
 */
export function timeAgo(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatDate(isoString);
  } catch {
    return '—';
  }
}

/**
 * Truncates a string to a maximum length, adding ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

/**
 * Safe null-coalesce for display values.
 * Returns a display-safe value — never NaN or undefined.
 */
export function safeNum(value: number | null | undefined, fallback = 0): number {
  const n = value ?? fallback;
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Returns initials from a name string (for avatar fallbacks).
 */
export function getInitials(name: string | null | undefined): string {
  const n = name || 'Student';
  return n
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Generates a deterministic color from a string (for avatar backgrounds).
 */
export function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 60%)`;
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
