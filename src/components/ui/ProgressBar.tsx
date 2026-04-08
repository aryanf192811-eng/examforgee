import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number | null | undefined;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'quill';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * ProgressBar — displays a percentage progress with gradient fill.
 * Always null-coalesces the value to 0.
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'quill',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const safeValue = value ?? 0;
  const percent = max > 0 ? Math.min(100, Math.max(0, (safeValue / max) * 100)) : 0;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-label-md text-on-surface-variant font-body">
            Progress
          </span>
          <span className="text-label-md text-on-surface font-body font-medium">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-container-high overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 spring-transition',
            variant === 'quill' ? 'progress-quill' : 'bg-primary'
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
