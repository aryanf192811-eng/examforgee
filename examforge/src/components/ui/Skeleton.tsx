import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'circle' | 'rect';
}

export function Skeleton({ className, lines = 1, variant = 'text' }: SkeletonProps) {
  const base = 'animate-pulse bg-surface-container-high rounded-lg';

  if (variant === 'circle') {
    return <div className={cn(base, 'rounded-full w-10 h-10', className)} />;
  }

  if (variant === 'card') {
    return (
      <div className={cn(base, 'p-6 space-y-4', className)}>
        <div className="h-4 bg-surface-container-highest rounded w-3/4" />
        <div className="h-3 bg-surface-container-highest rounded w-full" />
        <div className="h-3 bg-surface-container-highest rounded w-5/6" />
      </div>
    );
  }

  if (variant === 'rect') {
    return <div className={cn(base, 'h-32', className)} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(base, 'h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}
