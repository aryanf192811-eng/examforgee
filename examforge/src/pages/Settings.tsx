import { useThemeStore } from '../lib/store/themeStore';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <button 
        onClick={() => navigate('/profile')} 
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-4"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Identity Settings
      </button>

      <header className="space-y-2 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Workspace Preferences</h1>
      </header>

      <div className="space-y-6">
        <section className="bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            Aesthetic Configuration
          </h2>
          
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
            <div>
              <h3 className="font-bold text-on-surface">Editorial Theme</h3>
              <p className="text-sm text-on-surface-variant">Switch between Sakura Pastel and Tokyo Night.</p>
            </div>
            <button 
              onClick={toggle}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-bold text-on-surface opacity-50">Reduced Motion</h3>
              <p className="text-sm text-on-surface-variant opacity-50">Minimize animation fluidity.</p>
            </div>
            <button 
              disabled
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-surface-variant opacity-50 cursor-not-allowed"
            >
              <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">notifications</span>
            Academic Alerts
          </h2>
          
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
            <div>
              <h3 className="font-bold text-on-surface">Daily Review Reminder</h3>
              <p className="text-sm text-on-surface-variant">Notifications for spaced repetition queue.</p>
            </div>
            <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary transition-colors">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-8 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
