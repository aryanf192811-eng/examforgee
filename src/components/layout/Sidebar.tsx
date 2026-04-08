import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../lib/store/authStore';
import { useModalStore } from '../../lib/store/modalStore';
import { useTheme } from '../../hooks/useTheme';
import { getInitials, hashColor } from '../../lib/utils';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Notes', icon: 'menu_book', path: '/notes' },
  { label: 'Practice', icon: 'quiz', path: '/practice' },
  { label: 'Skills', icon: 'psychology', path: '/skills' },
  { label: 'Leaderboard', icon: 'leaderboard', path: '/leaderboard' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Profile', icon: 'person', path: '/profile' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { openUpgradeModal } = useModalStore();
  const { isDark, toggleTheme } = useTheme();

  const userName = user?.name || 'Student';
  const userRole = user?.role || 'free';

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-surface-container-low z-40">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[20px]">
            local_library
          </span>
        </div>
        <div>
          <h1 className="font-display text-title-lg text-on-surface leading-tight">
            ExamForge
          </h1>
          <span className="text-label-sm text-on-surface-variant">
            GATE CSE Prep
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.button
              key={item.path}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg transition-colors spring-transition cursor-pointer',
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[22px]',
                  isActive && 'font-variation-settings: "FILL" 1'
                )}
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-2 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg transition-colors spring-transition cursor-pointer',
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              )}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg text-on-surface-variant hover:bg-surface-container transition-colors spring-transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* User card */}
      <div className="px-3 pb-4 pt-2">
        <button 
          onClick={openUpgradeModal}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold text-white shrink-0"
            style={{ backgroundColor: hashColor(userName) }}
          >
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-label-lg text-on-surface truncate">
              {userName}
            </div>
            <div className="flex items-center gap-1">
              <div className="text-label-sm text-on-surface-variant capitalize">
                {userRole}
              </div>
              {userRole === 'free' && (
                <span className="material-symbols-outlined text-[14px] text-primary animate-pulse">
                  workspace_premium
                </span>
              )}
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
            upgrade
          </span>
        </button>
      </div>
    </aside>
  );
}
