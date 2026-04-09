import { useState, useCallback, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ToastContext, type ToastVariant } from '../../lib/contexts/ToastContext';

// ── Toast Types ──

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

const MAX_VISIBLE = 3;

const variantConfig: Record<ToastVariant, { icon: string; containerClass: string }> = {
  info: {
    icon: 'info',
    containerClass: 'bg-surface-container-highest text-on-surface',
  },
  success: {
    icon: 'check_circle',
    containerClass: 'bg-secondary-container text-on-secondary-container',
  },
  warning: {
    icon: 'warning',
    containerClass: 'bg-tertiary-container text-on-tertiary',
  },
  error: {
    icon: 'error',
    containerClass: 'bg-error-container text-on-error-container',
  },
};

// ── Toast Provider ──

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast: Toast = { id, message, variant, duration };

      setToasts((prev) => {
        const next = [...prev, toast];
        // Keep only the last MAX_VISIBLE
        return next.slice(-MAX_VISIBLE);
      });

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ── Single Toast Item ──

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const config = variantConfig[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl p-4',
        'backdrop-blur-xl border border-outline-variant/10',
        config.containerClass
      )}
    >
      <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
        {config.icon}
      </span>
      <p className="text-body-md flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 p-0.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </motion.div>
  );
}

// Re-export the hook
export { useToast } from '../../hooks/useToast';
