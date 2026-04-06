import { cn } from '../../lib/utils';

type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary-container text-secondary',
  tertiary: 'bg-tertiary-container text-tertiary',
  error: 'bg-error/10 text-error',
  success: 'bg-green-500/10 text-green-400',
  neutral: 'bg-surface-container-high text-on-surface-variant',
};

export function Badge({ variant = 'primary', icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
        'text-xs font-bold tracking-wider uppercase font-label',
        variants[variant],
        className
      )}
    >
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      {children}
    </span>
  );
}
