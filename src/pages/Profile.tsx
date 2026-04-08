import { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/store/authStore';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchProfile } from '../lib/api';
import type { UserProfile } from '../types';

export function Profile() {
  const { user, clearUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    navigate('/login');
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-2 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Curator Identity</h1>
      </header>

      <div className="bg-white dark:bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full academic-gradient flex items-center justify-center border-4 border-surface shadow-lg text-white font-display text-5xl">
           {profile?.name?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h2 className="font-display text-3xl font-bold text-on-surface mb-2">{profile?.name || user?.displayName || 'Editorial Scholar'}</h2>
          <p className="text-on-surface-variant font-mono">{user?.email}</p>
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Total Points</span>
                <span className="text-2xl font-display font-bold text-primary">
                  {((profile?.total_points ?? (profile as any)?.total_score ?? 0) / 1000).toFixed(1)}k
                </span>
             </div>
             <div className="w-px h-10 bg-outline-variant/20 hidden md:block"></div>
             <div className="flex flex-col text-center md:text-left">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Solved</span>
                <span className="text-2xl font-display font-bold text-on-surface">
                  {profile?.quizzes_taken ?? 0}
                </span>
             </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-widest border border-primary/20">
              {profile?.role === 'pro' ? 'Pro Tier' : 'Standard Member'}
            </span>
            <span className="px-3 py-1 bg-surface-variant text-on-surface-variant font-bold text-xs rounded-full uppercase tracking-widest">
              GATE {profile?.gate_year ?? '202X'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl p-6 border border-outline-variant/10 flex items-center justify-between" onClick={() => navigate('/settings')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-surface rounded-xl text-on-surface">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <div className="font-bold text-on-surface">Preferences</div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </div>

        <div className="bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl p-6 border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-surface rounded-xl text-on-surface">
              <span className="material-symbols-outlined">bookmarks</span>
            </div>
            <div className="font-bold text-on-surface">Saved Editorials</div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <Button variant="ghost" className="text-error border-error/50 hover:bg-error-container hover:text-on-error-container focus:ring-0" onClick={handleLogout}>
          Sign Out Workspace
        </Button>
      </div>

    </div>
  );
}
