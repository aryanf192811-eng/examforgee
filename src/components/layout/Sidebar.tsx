import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../lib/store/themeStore';
import { useAuthStore } from '../../lib/store/authStore';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/notes', icon: 'description', label: 'Notes' },
  { to: '/practice', icon: 'quiz', label: 'Practice' },
  { to: '/skills', icon: 'psychology', label: 'Skills' },
  { to: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { to: '/profile', icon: 'account_circle', label: 'Profile' },
];

export function Sidebar() {
  const { isDark, toggle } = useThemeStore();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 bg-surface-container-low border-r border-outline-variant/10">
      {/* Logo */}
      <div className="h-16 flex items-center px-6">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <span className="font-display text-xl font-semibold text-primary">ExamForge</span>
        </NavLink>
      </div>

      {/* Subtitle */}
      <div className="px-6 mb-6">
        <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant">
          The Digital Curator
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems?.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-xl"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-outline-variant/10">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span>{isDark ? 'Sakura Pastel' : 'Tokyo Night'}</span>
        </button>

        {/* User Chip */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container">
            <div className="w-8 h-8 rounded-full academic-gradient flex items-center justify-center text-white text-xs font-bold">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">
                {user.displayName || 'Student'}
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
