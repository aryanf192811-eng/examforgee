import { create } from 'zustand';
import type { ToastMessage, ToastType } from '../types';

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
    const toast: ToastMessage = { id, type, title, message, duration };
    set((s) => {
      // Max 3 visible, queue the rest by removing oldest
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

// ── Utility Functions ──

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

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
