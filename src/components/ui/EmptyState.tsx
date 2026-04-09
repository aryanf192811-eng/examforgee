import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  className?: string;
}

/**
 * EmptyState — shown when a page/section has no data.
 * Used instead of blank pages to maintain premium spatial awareness.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
          {icon}
        </span>
      </div>
      <h3 className="font-headline text-headline-sm text-on-surface mb-2">
        {title}
      </h3>
      <p className="text-body-md text-on-surface-variant max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="inline-flex items-center gap-2 gradient-cta text-on-primary px-5 py-2.5 rounded-xl font-semibold text-label-lg spring-transition cursor-pointer"
        >
          {action.icon && (
            <span className="material-symbols-outlined text-[18px]">
              {action.icon}
            </span>
          )}
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
