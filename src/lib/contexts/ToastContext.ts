import { createContext } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
