import { useAuthStore } from '../lib/store/authStore';

import { ProgressBar } from '../components/ui/ProgressBar';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">
          Welcome back, {user?.displayName || 'Curator'}.
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic">
          You've completed 84% of your weekly goal. Let's finish strong.
        </p>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main large stat card */}
        <div className="md:col-span-8 bg-white dark:bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">Subject Mastery</h2>
              <div className="font-display text-5xl font-bold flex items-baseline gap-2 text-on-surface">
                68<span className="text-2xl text-on-surface-variant">%</span>
              </div>
            </div>
            <div className="p-4 bg-primary-container text-on-primary-container rounded-2xl">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-on-surface">Algorithms</span>
                <span className="text-on-surface-variant">92%</span>
              </div>
              <ProgressBar value={92} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-on-surface">Data Structures</span>
                <span className="text-on-surface-variant">74%</span>
              </div>
              <ProgressBar value={74} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-on-surface">Operating Systems</span>
                <span className="text-on-surface-variant">41%</span>
              </div>
              <ProgressBar value={41} />
            </div>
          </div>
        </div>

        {/* Weekly Strike */}
        <div className="md:col-span-4 bg-surface-container-high dark:bg-surface-container rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10 relative">
          <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPlTqcgzVP0piVJIwYf9zjS_Ic_vxamat3D_sDdIR-4qV3T3yJy6ZuCBlgONITy8sy5pukcA9LrjJ6T_pPzcsbShlhP5SoozvP5zeZ08j5x2s9ZXTNLEpAoaoyWPgqvtE-j95N0dlUtfTFnFMRNF7v7AorJlnQj9PuZyE1ksahsODutwstYZ7HeElWPnyVyutIfd_S_O5jBl4OOkNoIgTKd10haeN9eUAuJM7MbqmwnCTOY6TnFPk4rLrG75QNIgHVRVmpRQaZNNgy')] opacity-[0.03] rounded-3xl pointer-events-none border border-white/20"></div>
          <div>
            <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-6">Current Streak</h2>
            <div className="font-display text-7xl font-bold text-primary mb-2">14</div>
            <p className="text-on-surface-variant font-medium">Days active</p>
          </div>
          <div className="flex gap-2 mt-8">
            {['M','T','W','T','F','S','S'].map((day, i) => (
              <div key={i} className={`flex-1 aspect-[1/2] rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-primary text-white academic-gradient shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}>{day}</div>
            ))}
          </div>
        </div>

        {/* Continue Learning */}
        <div className="md:col-span-6 bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm cursor-pointer hover:border-primary/30 transition-all group" onClick={() => navigate('/notes')}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Continue Reading</h3>
              <p className="text-sm text-on-surface-variant">Operating Systems</p>
            </div>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface leading-snug group-hover:text-primary transition-colors">
            Concurrency & Deadlocks: The Banker's Algorithm
          </p>
        </div>

        {/* Recommended Practice */}
        <div className="md:col-span-6 bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm cursor-pointer hover:border-secondary/30 transition-all group" onClick={() => navigate('/practice')}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">quiz</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Suggested Practice</h3>
              <p className="text-sm text-on-surface-variant">Algorithmic Complexity</p>
            </div>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface leading-snug group-hover:text-secondary transition-colors">
            Asymptotic Notation & Recurrence Relations Mock
          </p>
        </div>

      </div>
    </div>
  );
}
