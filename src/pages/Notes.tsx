import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { NotesViewer } from '../components/notes/NotesViewer';
import { DoubtDrawer } from '../components/notes/DoubtDrawer';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useBookmarks } from '../hooks/useBookmarks';
import { getChapters } from '../lib/api';
import { getManifest } from '../lib/manifest';
import { cn } from '../lib/utils';
import type { SubjectResponse, ChapterResponse } from '../types';

export default function Notes() {
  const { subjectSlug: urlSubjectSlug, chapterSlug: urlChapterSlug } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectResponse | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [doubtOpen, setDoubtOpen] = useState(false);

  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  // Load subjects from manifest
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoadingSubjects(true);
      try {
        const manifest = await getManifest();
        if (!cancelled) {
          const gateSubjects = manifest.subjects.filter(s => s.category !== 'skill') as any;
          setSubjects(gateSubjects);
          
          // If subjectSlug in URL, find and select it
          if (urlSubjectSlug) {
            const found = gateSubjects.find((s: any) => s.slug === urlSubjectSlug);
            if (found) setSelectedSubject(found);
          }
        }
      } catch (error) {
        console.error('Failed to load manifest in Notes.tsx:', error);
      } finally {
        if (!cancelled) setIsLoadingSubjects(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [urlSubjectSlug]);

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
        const data = await getChapters(selectedSubject!.slug);
        if (!cancelled) {
          setChapters(data ?? []);
          // If chapterSlug in URL, find and select it
          if (urlChapterSlug) {
            const found = data.find(c => c.slug === urlChapterSlug);
            if (found) setSelectedChapter(found);
          }
        }
      } catch {
        // handled
      } finally {
        if (!cancelled) setIsLoadingChapters(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedSubject, urlChapterSlug]);

  const handleBookmarkToggle = () => {
    if (!selectedChapter || !selectedSubject) return;
    if (isBookmarked(selectedChapter.id)) {
      removeBookmark(selectedChapter.id);
    } else {
      addBookmark(selectedChapter.id, selectedChapter.title, selectedSubject.name);
    }
  };

  const showViewer = !!selectedChapter;

  return (
    <AppShell title="Notes">
      <div className="flex gap-0 md:gap-6 h-[calc(100vh-120px)] -mx-4 md:-mx-6 -my-4 md:-my-6">
        {/* ── Left Panel ── */}
        {(!showViewer || !focusMode) && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'flex flex-col bg-surface-container-low overflow-y-auto custom-scrollbar',
              showViewer ? 'hidden md:flex md:w-72 shrink-0' : 'w-full md:w-72 shrink-0'
            )}
          >
            <div className="p-4">
              <h3 className="font-headline text-title-md text-on-surface mb-3">Subjects</h3>
              {isLoadingSubjects ? (
                <Skeleton variant="chapter-list" count={4} />
              ) : (
                <div className="space-y-1">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSubject(s);
                        setSelectedChapter(null);
                        navigate(`/notes/${s.slug}`);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl text-label-lg transition-colors cursor-pointer',
                        selectedSubject?.id === s.id
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">{s.icon || 'folder'}</span>
                        <span className="truncate">{s.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedSubject && (
              <div className="p-4 pt-0">
                <h3 className="font-headline text-title-md text-on-surface mb-3">Chapters</h3>
                {isLoadingChapters ? (
                  <Skeleton variant="chapter-list" count={6} />
                ) : (
                  <div className="space-y-1">
                    {chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapter(ch);
                          navigate(`/notes/${selectedSubject.slug}/${ch.slug}`);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-xl text-label-lg transition-colors cursor-pointer',
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

        {/* ── Right Panel ── */}
        <div className={cn('flex-1 flex flex-col min-w-0', !showViewer && 'hidden md:flex')}>
          {showViewer && selectedChapter && selectedSubject ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low shrink-0">
                <button onClick={() => setSelectedChapter(null)} className="md:hidden p-1.5 rounded-lg hover:bg-surface-container cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                </button>
                <div className="flex items-center gap-2">
                   <button onClick={() => setFocusMode(!focusMode)} className="p-2 rounded-xl hover:bg-surface-container cursor-pointer hidden md:flex">
                    <span className="material-symbols-outlined text-[20px]">{focusMode ? 'close_fullscreen' : 'open_in_full'}</span>
                  </button>
                  <button onClick={handleBookmarkToggle} className="p-2 rounded-xl hover:bg-surface-container cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]" style={isBookmarked(selectedChapter.id) ? { fontVariationSettings: '"FILL" 1', color: 'var(--color-primary)' } : { color: 'var(--color-on-surface-variant)' }}>bookmark</span>
                  </button>
                  <button onClick={() => setDoubtOpen(true)} className="p-2 rounded-xl hover:bg-surface-container cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <NotesViewer subjectSlug={selectedSubject.slug} chapterSlug={selectedChapter.slug} chapterTitle={selectedChapter.title} subjectName={selectedSubject.name} />
              </div>
              <DoubtDrawer isOpen={doubtOpen} onClose={() => setDoubtOpen(false)} chapterTitle={selectedChapter.title} subjectName={selectedSubject.name} selectedText="" />
            </>
          ) : (
            <EmptyState icon="menu_book" title="Select a chapter" description="Choose a subject and chapter from the sidebar to start reading." />
          )}
        </div>
      </div>
    </AppShell>
  );
}
