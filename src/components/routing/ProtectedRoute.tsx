import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute — Ensures only authenticated scholars can access archive sections.
 * Redirects to /login if no valid session is found.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const location = useLocation();

  // If we're performing initial auth check OR we have a Firebase user but no backend profile yet,
  // we treat it as a loading state to allow Login.tsx to complete the sync.
  if (isAuthLoading || (firebaseUser && !user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-cta flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-on-primary text-[24px]">local_library</span>
          </div>
          <span className="text-label-lg text-on-surface-variant font-headline">Accessing Archives...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
