import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLoader } from '../ui/PageLoader';
import { PageTransition } from '../ui/PageTransition';

// ── Lazy page imports — Phase 5 Refinement ──
const Landing = lazy(() => import('../../pages/Landing'));
const Login = lazy(() => import('../../pages/Login'));
const Signup = lazy(() => import('../../pages/Signup'));
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const Notes = lazy(() => import('../../pages/Notes'));
const Practice = lazy(() => import('../../pages/Practice'));
const Skills = lazy(() => import('../../pages/Skills'));
const Leaderboard = lazy(() => import('../../pages/Leaderboard'));
const Profile = lazy(() => import('../../pages/Profile'));
const Settings = lazy(() => import('../../pages/Settings'));

/**
 * AnimatedRoutes — Main routing orchestration component.
 * Separated to satisfy Fast Refresh only-export-components rule.
 */
export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><PageTransition><Notes /></PageTransition></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PageTransition><Practice /></PageTransition></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><PageTransition><Skills /></PageTransition></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
