import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../lib/utils';
import { cn } from '../../lib/utils';

const iconMap = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const colorMap = {
  success: 'text-green-400 bg-green-500/10',
  error: 'text-error bg-error/10',
  warning: 'text-amber-400 bg-amber-500/10',
  info: 'text-tertiary bg-tertiary/10',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-80">
      <AnimatePresence mode="popLayout">
        {toasts?.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl',
              'bg-surface-container-high border border-outline-variant/10',
              'backdrop-blur-xl'
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined text-xl p-1 rounded-lg shrink-0',
                colorMap[toast.type]
              )}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {iconMap[toast.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface font-label">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-on-surface-variant mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
