import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  keywords: string[];
}

const commands: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', keywords: ['home', 'start'] },
  { id: 'notes', label: 'Notes', icon: 'menu_book', path: '/notes', keywords: ['study', 'read'] },
  { id: 'practice', label: 'Practice', icon: 'quiz', path: '/practice', keywords: ['quiz', 'test'] },
  { id: 'skills', label: 'Skills', icon: 'psychology', path: '/skills', keywords: ['track', 'learn'] },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard', path: '/leaderboard', keywords: ['rank', 'score'] },
  { id: 'profile', label: 'Profile', icon: 'person', path: '/profile', keywords: ['account', 'me'] },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings', keywords: ['preferences', 'theme'] },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = query.trim()
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.keywords.some((kw) => kw.includes(query.toLowerCase()))
      )
    : commands;

  const handleSelect = useCallback(
    (path: string) => {
      setIsOpen(false);
      setQuery('');
      navigate(path);
    },
    [navigate]
  );

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl bg-surface-container overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-high">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-on-surface text-body-md outline-none placeholder:text-outline font-body"
              />
              <kbd className="text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-body-md text-on-surface-variant">
                  No results found
                </div>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-label-lg text-on-surface-variant',
                      'hover:bg-surface-container-high transition-colors cursor-pointer'
                    )}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {cmd.icon}
                    </span>
                    {cmd.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
