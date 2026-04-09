import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Notes } from './pages/Notes';
import { Practice } from './pages/Practice';
import { Skills } from './pages/Skills';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useAuthStore } from './lib/store/authStore';
import { onAuthStateChanged, auth, getIdToken } from './lib/firebase';
import { usePlatformSecurity } from './hooks/usePlatformSecurity';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">auto_stories</span>
          <span className="font-display text-lg text-on-surface-variant">Loading your curriculum…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  usePlatformSecurity();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken();
        setUser(firebaseUser, 'student', token);
      } else {
        setUser(null, null, null);
      }
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated */}
        <Route
          element={
            <AuthGate>
              <AppShell />
            </AuthGate>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:subjectSlug" element={<Notes />} />
          <Route path="/notes/:subjectSlug/:chapterSlug" element={<Notes />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:subjectSlug" element={<Practice />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
