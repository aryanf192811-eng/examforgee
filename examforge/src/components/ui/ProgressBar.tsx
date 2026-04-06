import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressBar({ value, className, size = 'sm', showLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full bg-surface-container-high overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className="progress-quill rounded-full transition-all duration-600 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-mono text-on-surface-variant mt-1">{Math.round(clamped)}%</p>
      )}
    </div>
  );
}
