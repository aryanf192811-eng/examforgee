import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { DashboardSkeleton } from '../dashboard/DashboardSkeleton';

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
  // we treat it as a loading state to allow the initializer hook to complete the sync.
  if (isAuthLoading || (firebaseUser && !user)) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
