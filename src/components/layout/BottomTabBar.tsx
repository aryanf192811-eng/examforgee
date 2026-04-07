import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const tabs = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/notes', icon: 'description', label: 'Notes' },
  { to: '/practice', icon: 'quiz', label: 'Practice' },
  { to: '/skills', icon: 'psychology', label: 'Skills' },
  { to: '/leaderboard', icon: 'leaderboard', label: 'Rank' },
];

export function BottomTabBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 dark:bg-surface/90 backdrop-blur-2xl flex justify-around items-center px-4 pb-6 pt-3 shadow-[0_-10px_40px_rgba(104,52,235,0.08)] rounded-t-3xl border-t border-outline-variant/5">
      {tabs?.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary rounded-2xl px-4 py-1'
                : 'text-on-surface-variant px-4 py-1'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label text-[10px] uppercase tracking-tighter mt-1">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
