import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { NotesViewer } from '../components/notes/NotesViewer';
import { DoubtDrawer } from '../components/notes/DoubtDrawer';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useBookmarks } from '../hooks/useBookmarks';
import { getSubjects, getChapters } from '../lib/api';
import { cn } from '../lib/utils';
import type { SubjectResponse, ChapterResponse } from '../types';

export default function Notes() {
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectResponse | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [doubtOpen, setDoubtOpen] = useState(false);

  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  // Load subjects
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoadingSubjects(true);
      try {
        const data = await getSubjects();
        if (!cancelled) setSubjects(data ?? []);
      } catch {
        // handled
      } finally {
        if (!cancelled) setIsLoadingSubjects(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Load chapters when subject selected
  useEffect(() => {
    if (!selectedSubject) {
      setChapters([]);
      return;
    }
    let cancelled = false;
    async function load() {
      setIsLoadingChapters(true);
      try {
        const data = await getChapters(selectedSubject!.id);
        if (!cancelled) setChapters(data ?? []);
      } catch {
        // handled
      } finally {
        if (!cancelled) setIsLoadingChapters(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedSubject]);

  const handleBookmarkToggle = () => {
    if (!selectedChapter || !selectedSubject) return;
    if (isBookmarked(selectedChapter.id)) {
      removeBookmark(selectedChapter.id);
    } else {
      addBookmark(selectedChapter.id, selectedChapter.title, selectedSubject.name);
    }
  };

  // Mobile: show viewer full-screen when chapter selected
  const showViewer = !!selectedChapter;

  return (
    <AppShell title="Notes">
      <div className="flex gap-0 md:gap-6 h-[calc(100vh-120px)] -mx-4 md:-mx-6 -my-4 md:-my-6">
        {/* ── Left Panel: Subject & Chapter List ── */}
        {(!showViewer || !focusMode) && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'flex flex-col bg-surface-container-low overflow-y-auto custom-scrollbar',
              showViewer ? 'hidden md:flex md:w-72 shrink-0' : 'w-full md:w-72 shrink-0'
            )}
          >
            {/* Subjects */}
            <div className="p-4">
              <h3 className="font-headline text-title-md text-on-surface mb-3">
                Subjects
              </h3>
              {isLoadingSubjects ? (
                <Skeleton variant="chapter-list" count={4} />
              ) : subjects.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No subjects available</p>
              ) : (
                <div className="space-y-1">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSubject(s);
                        setSelectedChapter(null);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl text-label-lg transition-colors spring-transition cursor-pointer',
                        selectedSubject?.id === s.id
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                          {s.icon || 'folder'}
                        </span>
                        <span className="truncate">{s.name}</span>
                      </div>
                      {s.chapter_count != null && (
                        <span className="text-label-sm text-on-surface-variant ml-7">
                          {s.chapter_count ?? 0} chapters
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chapters */}
            {selectedSubject && (
              <div className="p-4 pt-0">
                <h3 className="font-headline text-title-md text-on-surface mb-3">
                  Chapters
                </h3>
                {isLoadingChapters ? (
                  <Skeleton variant="chapter-list" count={6} />
                ) : chapters.length === 0 ? (
                  <p className="text-body-sm text-on-surface-variant">No chapters yet</p>
                ) : (
                  <div className="space-y-1">
                    {chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChapter(ch)}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-xl text-label-lg transition-colors spring-transition cursor-pointer',
                          selectedChapter?.id === ch.id
                            ? 'bg-primary-container text-on-primary-container font-semibold'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        )}
                      >
                        <span className="truncate block">{ch.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        )}

        {/* ── Right Panel: Notes Viewer ── */}
        <div className={cn(
          'flex-1 flex flex-col min-w-0',
          !showViewer && 'hidden md:flex'
        )}>
          {showViewer && selectedChapter && selectedSubject ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low shrink-0">
                {/* Back button (mobile) */}
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">
                    arrow_back
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {/* Focus Mode */}
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer hidden md:flex"
                    title={focusMode ? 'Exit focus mode' : 'Focus mode'}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      {focusMode ? 'close_fullscreen' : 'open_in_full'}
                    </span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={handleBookmarkToggle}
                    className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                    title={isBookmarked(selectedChapter.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={
                        isBookmarked(selectedChapter.id)
                          ? { fontVariationSettings: '"FILL" 1', color: 'var(--color-primary)' }
                          : { color: 'var(--color-on-surface-variant)' }
                      }
                    >
                      bookmark
                    </span>
                  </button>

                  {/* Doubt */}
                  <button
                    onClick={() => setDoubtOpen(true)}
                    className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                    title="Ask a doubt"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      help
                    </span>
                  </button>
                </div>
              </div>

              {/* Notes content */}
              <div className="flex-1 overflow-hidden">
                <NotesViewer
                  chapterId={selectedChapter.id}
                  chapterTitle={selectedChapter.title}
                  subjectName={selectedSubject.name}
                />
              </div>

              {/* Doubt Drawer */}
              <DoubtDrawer
                isOpen={doubtOpen}
                onClose={() => setDoubtOpen(false)}
                chapterTitle={selectedChapter.title}
                subjectName={selectedSubject.name}
                selectedText=""
              />
            </>
          ) : (
            <EmptyState
              icon="menu_book"
              title="Select a chapter"
              description="Choose a subject and chapter from the sidebar to start reading."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
