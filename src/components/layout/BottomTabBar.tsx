import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface TabItem {
  label: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  { label: 'Home', icon: 'dashboard', path: '/dashboard' },
  { label: 'Notes', icon: 'menu_book', path: '/notes' },
  { label: 'Practice', icon: 'quiz', path: '/practice' },
  { label: 'Ranks', icon: 'leaderboard', path: '/leaderboard' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

/**
 * BottomTabBar component — mobile primary navigation.
 * Features a glassmorphic aesthetic with reach-optimized touch targets.
 * Matches the "Atelier" design system's interactive patterns.
 */
export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 glass flex items-center justify-around px-2 border-t border-outline-variant/10">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors spring-transition cursor-pointer',
              isActive
                ? 'text-primary'
                : 'text-on-surface-variant'
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-label-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
