import { useThemeStore } from '../../lib/store/themeStore';
import { useAuthStore } from '../../lib/store/authStore';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { isDark, toggle } = useThemeStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 glass flex items-center justify-between px-4 border-b border-outline-variant/10">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
        <span className="font-display text-lg font-semibold text-primary">ExamForge</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full academic-gradient flex items-center justify-center text-white text-xs font-bold"
        >
          {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
}
