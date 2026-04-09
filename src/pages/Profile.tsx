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
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-12 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 text-center md:text-left mt-10">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface text-transparent bg-clip-text academic-gradient">
          Curator Identity
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic">The synthesized profile of your academic journey.</p>
      </header>

      <div className="bg-surface-container-low rounded-[3rem] p-10 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full academic-gradient flex items-center justify-center border-8 border-surface shadow-2xl text-white font-display text-6xl group-hover:scale-105 transition-transform duration-500">
           {profile?.name?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || 'A'}
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
          <h2 className="font-display text-4xl font-bold text-on-surface leading-tight">
            {profile?.name || user?.displayName || 'Editorial Agent'}
          </h2>
          <p className="text-on-surface-variant font-mono text-lg">{user?.email}</p>
          
          <div className="pt-6 flex flex-wrap gap-8 justify-center md:justify-start">
             <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">Total Points</span>
                <span className="text-3xl font-display font-bold text-primary">
                  {profile?.total_points.toLocaleString() || "0"}
                </span>
             </div>
             <div className="w-px h-12 bg-outline-variant/20 hidden md:block"></div>
             <div className="flex flex-col text-center md:text-left">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">Quizzes Taken</span>
                <span className="text-3xl font-display font-bold text-on-surface">
                  {profile?.quizzes_taken || 0}
                </span>
             </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="px-5 py-2 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-widest border border-primary/20">
              {profile?.role === 'pro' ? 'Pro Access' : 'Standard Tier'}
            </span>
            <span className="px-5 py-2 bg-surface-variant/30 text-on-surface-variant font-bold text-xs rounded-full uppercase tracking-widest border border-outline-variant/20">
              GATE {profile?.gate_year || '2025'} Candidate
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer rounded-[2rem] p-8 border border-outline-variant/10 flex items-center justify-between group shadow-sm hover:shadow-xl" onClick={() => navigate('/settings')}>
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white dark:bg-surface rounded-2xl text-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </div>
            <div className="font-bold text-xl text-on-surface">Workspace Settings</div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-2 transition-transform">chevron_right</span>
        </div>

        <div className="bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer rounded-[2rem] p-8 border border-outline-variant/10 flex items-center justify-between group shadow-sm hover:shadow-xl">
            <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white dark:bg-surface rounded-2xl text-on-surface flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-2xl">bookmarks</span>
            </div>
            <div className="font-bold text-xl text-on-surface">Saved Insights</div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-2 transition-transform">chevron_right</span>
        </div>
      </div>

      <div className="pt-12 flex justify-center">
        <Button variant="ghost" className="text-error border-error/20 px-10 h-14 rounded-full hover:bg-error/5 hover:border-error/50 transition-all font-bold" onClick={handleLogout}>
          Sign Out Workspace
        </Button>
      </div>
    </div>
  );
}
