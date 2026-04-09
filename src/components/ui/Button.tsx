import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  isLoading?: boolean; // legacy alias
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'gradient-cta text-on-primary font-semibold glow-primary hover:opacity-90',
  secondary:
    'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/10',
  tertiary:
    'bg-transparent text-primary hover:bg-primary/5',
  ghost:
    'bg-transparent text-on-surface-variant hover:bg-surface-container',
  destructive:
    'bg-error-container text-on-error-container hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-label-md rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-label-lg rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-title-md rounded-2xl gap-2.5',
};

/**
 * Button component — the primary action element of the Atelier design system.
 * Supports spring-based motion feedback and multiple stylistic variants.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isActuallyLoading = loading || isLoading;
  
  // Omit conflicting props from framer-motion to avoid runtime warnings
  const { onAnimationStart, onDrag, onDragStart, onDragEnd, ...rest } = props as any;

  return (
    <motion.button
      whileHover={{ scale: disabled || isActuallyLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isActuallyLoading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center spring-transition transition-all duration-200 cursor-pointer select-none',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || isActuallyLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isActuallyLoading}
      {...rest}
    >
      {isActuallyLoading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">
          progress_activity
        </span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {iconRight && !isActuallyLoading && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </motion.button>
  );
}
