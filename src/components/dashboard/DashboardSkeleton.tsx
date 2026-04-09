import { AppShell } from '../layout/AppShell';
import { Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <AppShell title="Loading Dashboard">
      <div className="space-y-6 animate-pulse">
        {/* Welcome Card Skeleton */}
        <Skeleton variant="card" className="h-40 rounded-2xl" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-24 rounded-2xl" />
          ))}
        </div>
        
        {/* Charts Row Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-[300px]" />
          <Skeleton variant="card" className="h-[300px]" />
        </div>
        
        {/* Actions Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton variant="rect" className="h-14 rounded-xl" />
          <Skeleton variant="rect" className="h-14 rounded-xl" />
          <Skeleton variant="rect" className="h-14 rounded-xl" />
        </div>
      </div>
    </AppShell>
  );
}
