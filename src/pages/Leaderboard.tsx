import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuthStore } from '../lib/store/authStore';
import { getLeaderboard } from '../lib/api';
import { cn, formatNumber, getInitials, hashColor, safeNum } from '../lib/utils';
import type { LeaderboardEntry } from '../types';

type Tab = 'weekly' | 'all-time';

export default function Leaderboard() {
  const user = useAuthStore((s) => s.user);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('weekly');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getLeaderboard();
        if (!cancelled) setEntries(data ?? []);
      } catch { /* handled */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const sorted = [...entries].sort((a, b) => {
    if (tab === 'weekly') {
      return safeNum(b.weekly_points) - safeNum(a.weekly_points);
    }
    const aScore = safeNum(a.total_points);
    const bScore = safeNum(b.total_points);
    return bScore - aScore;
  });

  return (
    <AppShell title="Leaderboard">
      <div className="max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container mb-6 w-fit mx-auto">
          {(['weekly', 'all-time'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-5 py-2 rounded-lg text-label-lg transition-colors spring-transition capitalize cursor-pointer',
                tab === t
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {t === 'all-time' ? 'All Time' : 'Weekly'}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <Skeleton variant="table-row" count={10} />
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-4 block">
              leaderboard
            </span>
            <p className="text-body-md text-on-surface-variant">
              No leaderboard data yet. Start practicing to see rankings!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5"
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-2 text-label-md text-on-surface-variant">
              <span className="w-8 text-center">#</span>
              <span className="w-8" />
              <span className="flex-1">Name</span>
              <span className="w-20 text-right">Score</span>
            </div>

            {sorted.map((entry, i) => {
              const rank = safeNum(entry.rank, i + 1);
              const score = tab === 'weekly'
                ? safeNum(entry.weekly_points)
                : safeNum(entry.total_points);
              const isCurrentUser = entry.uid === user?.uid;
              const name = entry.name || 'Student';

              return (
                <motion.div
                  key={entry.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-colors',
                    isCurrentUser
                      ? 'bg-primary-container'
                      : 'bg-surface-container hover:bg-surface-container-high'
                  )}
                >
                  {/* Rank */}
                  <span className={cn(
                    'w-8 text-center font-display text-title-md',
                    rank <= 3 ? 'text-primary' : 'text-on-surface-variant'
                  )}>
                    {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                  </span>

                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold text-white shrink-0"
                    style={{ backgroundColor: hashColor(name) }}
                  >
                    {getInitials(name)}
                  </div>

                  {/* Name */}
                  <span className={cn(
                    'flex-1 text-body-md truncate',
                    isCurrentUser ? 'text-on-primary-container font-semibold' : 'text-on-surface'
                  )}>
                    {name}
                    {isCurrentUser && (
                      <span className="text-label-sm ml-2 opacity-70">(You)</span>
                    )}
                  </span>

                  {/* Score */}
                  <span className={cn(
                    'w-20 text-right font-mono text-label-lg',
                    isCurrentUser ? 'text-on-primary-container' : 'text-on-surface'
                  )}>
                    {formatNumber(score)}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
