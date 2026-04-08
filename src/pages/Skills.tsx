import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Skeleton } from '../components/ui/Skeleton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { getSubjects, getChapters } from '../lib/api';
import { cn, safeNum } from '../lib/utils';
import type { SubjectResponse, ChapterResponse } from '../types';

export default function Skills() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getSubjects();
        if (!cancelled) setSubjects(data ?? []);
      } catch { /* handled */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleExpand = async (subjectId: string) => {
    if (expandedTrack === subjectId) {
      setExpandedTrack(null);
      setChapters([]);
      return;
    }

    setExpandedTrack(subjectId);
    setIsLoadingChapters(true);
    try {
      const data = await getChapters(subjectId);
      setChapters(data ?? []);
    } catch {
      setChapters([]);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  return (
    <AppShell title="Skills">
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-headline-lg text-on-surface mb-2">
              Skill Tracks
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Master each track through structured learning paths
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.filter(s => s.category === 'skill').map((s, i) => {
              const chapCount = safeNum(s.chapter_count);
              const isExpanded = expandedTrack === s.id;
              const isComingSoon = chapCount === 0;
              
              // Visual rotation for variety
              const colors = ['primary', 'secondary', 'tertiary'];
              const color = colors[i % colors.length];

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
                  className={cn(
                    "rounded-2xl bg-surface-container overflow-hidden border-2 border-transparent transition-all",
                    isComingSoon && "opacity-80 scale-[0.98]"
                  )}
                >
                  <button
                    onClick={() => !isComingSoon && handleExpand(s.id)}
                    disabled={isComingSoon}
                    className={cn(
                      "w-full text-left p-5 transition-colors spring-transition",
                      !isComingSoon ? "cursor-pointer hover:bg-surface-container-high" : "cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        color === 'primary' && 'bg-primary-container',
                        color === 'secondary' && 'bg-secondary-container',
                        color === 'tertiary' && 'bg-tertiary-container',
                      )}>
                        <span className={cn(
                          'material-symbols-outlined text-[20px]',
                          color === 'primary' && 'text-on-primary-container',
                          color === 'secondary' && 'text-on-secondary-container',
                          color === 'tertiary' && 'text-on-tertiary',
                        )}>
                          {s.icon || 'psychology'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline text-title-md text-on-surface">
                            {s.name}
                          </h3>
                          {isComingSoon && (
                            <Badge variant="secondary" size="sm">Soon</Badge>
                          )}
                        </div>
                        <span className="text-label-sm text-on-surface-variant">
                          {chapCount} chapters
                        </span>
                      </div>
                      {!isComingSoon && (
                        <span className={cn(
                          'material-symbols-outlined text-on-surface-variant transition-transform',
                          isExpanded && 'rotate-180'
                        )}>
                          expand_more
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      value={s.progress_pct ?? 0}
                      size="sm"
                      variant="quill"
                    />
                  </button>

                  {/* Expanded chapters */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-4 space-y-1.5 overflow-hidden"
                      >
                        {isLoadingChapters ? (
                          <Skeleton variant="chapter-list" count={3} />
                        ) : chapters.length === 0 ? (
                          <p className="text-body-sm text-on-surface-variant py-2">
                            No chapters available
                          </p>
                        ) : (
                          chapters.map((ch) => (
                            <button
                              key={ch.id}
                              onClick={() => navigate(`/notes?chapterId=${ch.id}`)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {ch.has_notes ? 'article' : 'draft'}
                              </span>
                              <span className="truncate flex-1 text-left">{ch.title}</span>
                              <ProgressBar
                                value={ch.user_status === 'done' ? 100 : ch.user_status === 'in_progress' ? 50 : 0}
                                size="sm"
                                className="w-16"
                              />
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}
