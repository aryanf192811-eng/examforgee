import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  iconRight?: string;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'academic-gradient text-white sakura-glow hover:scale-[1.02] active:scale-[0.98] transition-transform',
  secondary:
    'bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors border border-outline-variant/10',
  tertiary:
    'bg-transparent text-primary hover:bg-primary/5 transition-colors',
  destructive:
    'bg-error/10 text-error hover:bg-error/20 transition-colors',
  ghost:
    'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors',
};

export function Button({
  variant = 'primary',
  icon,
  iconRight,
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full px-6 py-3 font-label font-semibold text-sm',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-base">{icon}</span>
      ) : null}
      {children}
      {iconRight && !isLoading && (
        <span className="material-symbols-outlined text-base">{iconRight}</span>
      )}
    </button>
  );
}
