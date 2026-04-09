import { Skeleton } from './Skeleton';

/**
 * PageLoader — Specialized placeholder for lazy-loaded route transitions.
 * Adheres to rule #13 (No raw spinners).
 */
export function PageLoader() {
  return (
    <div className="min-h-[80vh] flex flex-col gap-6 p-6">
      <Skeleton variant="rect" className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton variant="rect" className="h-32 rounded-2xl" />
        <Skeleton variant="rect" className="h-32 rounded-2xl" />
        <Skeleton variant="rect" className="h-32 rounded-2xl" />
        <Skeleton variant="rect" className="h-32 rounded-2xl" />
      </div>
      <Skeleton variant="card" />
    </div>
  );
}
