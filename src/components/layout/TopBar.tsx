import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { getInitials, hashColor } from '../../lib/utils';

import type { ReactNode } from 'react';

interface TopBarProps {
  title?: string;
  headerActions?: ReactNode;
}

export function TopBar({ title, headerActions }: TopBarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { isDark, toggleTheme } = useTheme();

  const userName = user?.name || 'Student';

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-6 glass">
      {/* Mobile brand / page title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-1.5 rounded-lg hover:bg-surface-container transition-colors spring-transition cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <span className="material-symbols-outlined text-on-surface text-[22px]">
            local_library
          </span>
        </button>
        {title && (
          <h2 className="font-headline text-title-lg text-on-surface hidden sm:block">
            {title}
          </h2>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {headerActions}
        
        {/* Theme toggle (mobile) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-surface-container transition-colors spring-transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Profile avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold text-white shrink-0 cursor-pointer"
          style={{ backgroundColor: hashColor(userName) }}
        >
          {getInitials(userName)}
        </button>
      </div>
    </header>
  );
}
