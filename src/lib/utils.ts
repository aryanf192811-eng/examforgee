import { create } from 'zustand';
import type { ToastMessage, ToastType } from '../types';

/**
 * ExamForge Utility Functions
 * Shared helpers used across the application.
 */

let toastIdCounter = 0;

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message, duration = 4000) => {
    const id = `toast-${++toastIdCounter}`;
    const toast: ToastMessage = { id, type, title, message: message || '', duration };
    set((s) => {
      const next = [...s.toasts, toast];
      return { toasts: next.length > 3 ? next.slice(-3) : next };
    });
    if (duration > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/**
 * Combines CSS class names, filtering out falsy values.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number with commas for display.
 */
export function formatNumber(value: number | null | undefined, fallback = 0): string {
  return (value ?? fallback).toLocaleString();
}

/**
 * Formats a percentage value for display.
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
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats an ISO date string into a readable format.
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
 * Generates a deterministic color from a string.
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
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Converts a subject slug back to a formal title.
 */
export function slugToTitle(slug: string): string {
  const map: Record<string, string> = {
    algo: 'Algorithms',
    cd: 'Compiler Design',
    cn: 'Computer Networks',
    coa: 'Computer Organization',
    cprog: 'C Programming',
    dbms: 'Database Systems',
    dl: 'Digital Logic',
    dm: 'Discrete Mathematics',
    dsa: 'Data Structures',
    em: 'Engineering Mathematics',
    ga: 'General Aptitude',
    os: 'Operating Systems',
    toc: 'Theory of Computation',
  };
  return map[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Mapping of subjects to Google Font Material Icons.
 */
export const subjectIcons: Record<string, string> = {
  algo: 'sort',
  cd: 'memory',
  cn: 'language',
  coa: 'developer_board',
  cprog: 'code',
  dbms: 'storage',
  dl: 'electrical_services',
  dm: 'functions',
  dsa: 'account_tree',
  em: 'calculate',
  ga: 'psychology',
  os: 'settings_applications',
  toc: 'schema',
};
