import { cn } from '../../lib/utils';

type SkeletonVariant = 'text' | 'card' | 'chapter-list' | 'stat-ring' | 'table-row' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  lines?: number;
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

function SkeletonBase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('skeleton-shimmer rounded-xl', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

function TextSkeleton({ lines = 3 }: { lines: number }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/5' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container p-5 space-y-4">
      <SkeletonBase className="h-5 w-2/3" />
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-4/5" />
      <div className="flex gap-3 pt-2">
        <SkeletonBase className="h-8 w-20 rounded-lg" />
        <SkeletonBase className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

function ChapterListSkeleton({ count = 6 }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-surface-container p-3"
        >
          <SkeletonBase className="h-5 w-5 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatRingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <SkeletonBase className="h-24 w-24 rounded-full" />
      <SkeletonBase className="h-4 w-16" />
    </div>
  );
}

function TableRowSkeleton({ count = 10 }: { count: number }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl bg-surface-container p-3"
        >
          <SkeletonBase className="h-4 w-8 shrink-0" />
          <SkeletonBase className="h-8 w-8 rounded-full shrink-0" />
          <SkeletonBase className="h-4 flex-1" />
          <SkeletonBase className="h-4 w-16 shrink-0" />
          <SkeletonBase className="h-4 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton component — used for ALL loading states.
 * No raw spinners allowed per design system guidelines.
 */
export function Skeleton({
  variant = 'rect',
  lines = 3,
  count = 6,
  className,
  width,
  height,
}: SkeletonProps) {
  switch (variant) {
    case 'text':
      return <TextSkeleton lines={lines} />;
    case 'card':
      return <CardSkeleton />;
    case 'chapter-list':
      return <ChapterListSkeleton count={count} />;
    case 'stat-ring':
      return <StatRingSkeleton />;
    case 'table-row':
      return <TableRowSkeleton count={count} />;
    case 'rect':
    default:
      return (
        <SkeletonBase
          className={cn(className)}
          style={{ width, height }}
        />
      );
  }
}
