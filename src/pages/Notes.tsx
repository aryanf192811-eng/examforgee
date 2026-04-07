import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchSubjects, fetchChapters, loadNoteHtml, updateNoteProgress } from "../lib/api";
import type { SubjectResponse, ChapterResponse } from "../types";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export function Notes() {
  const { subjectSlug, chapterId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [noteHtml, setNoteHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const timeStarted = useRef<number>(Date.now());
  const noteContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load chapters when subject changes
  useEffect(() => {
    if (subjectSlug && subjectSlug !== "intro") {
      async function loadChapters() {
        try {
          const subject = (Array.isArray(subjects) ? subjects : []).find((s) => s.slug === subjectSlug);
          if (subject) {
            const data = await fetchChapters(subject.id);
            setChapters(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error(err);
        }
      }
      loadChapters();
    }
  }, [subjectSlug, subjects]);

  // Load note content when chapterId changes
  useEffect(() => {
    if (chapterId) {
      async function fetchNote() {
        setNoteLoading(true);
        try {
          // chapterId is guaranteed non-null here due to if(chapterId)
          const html = await loadNoteHtml(chapterId as string);
          setNoteHtml(html);
          timeStarted.current = Date.now();
        } catch (err) {
          console.error(err);
          setNoteHtml("<p class='text-error'>Failed to load note content.</p>");
        } finally {
          setNoteLoading(false);
        }
      }
      fetchNote();
    } else {
      setNoteHtml(null);
    }
  }, [chapterId]);

  // KaTeX Auto-render effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteHtml && noteContentRef.current) {
        renderMathInElement(noteContentRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          throwOnError: false,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [noteHtml]);

  const handleMarkAsDone = async () => {
    if (!chapterId) return;
    setProgressSaving(true);
    try {
      const timeSpent = Math.floor((Date.now() - timeStarted.current) / 1000);
      await updateNoteProgress({
        chapter_id: chapterId,
        status: "done",
        time_spent_s: timeSpent
      });
      
      setChapters(prev => prev.map(c => 
        c.id === chapterId ? { ...c, user_status: 'done' } : c
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setProgressSaving(false);
    }
  };

  const subject = (Array.isArray(subjects) ? subjects : []).find((s) => s.slug === subjectSlug);
  const currentChapter = chapters.find((c) => c.id === chapterId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // List all subjects if no subject selected
  if (!subjectSlug || subjectSlug === "intro") {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
        <header className="space-y-4 mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">
            Curriculum Repository
          </h1>
          <p className="text-on-surface-variant text-lg font-notes italic">
            Select a discipline to begin your ideological synthesis.
          </p>
        </header>

        {subjects.length === 0 ? (
          <EmptyState
            icon="menu_book"
            title="No Subjects Found"
            description="The curriculum is currently being updated. Please check back later."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(subjects) ? subjects : []).map((sub) => (
              <Link
                key={sub.id}
                to={`/notes/${sub.slug}`}
                className="group relative bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                  {sub.icon?.includes("<svg") ? (
                    <div dangerouslySetInnerHTML={{ __html: sub.icon }} className="w-8 h-8" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl">
                      {sub.icon || "receipt_long"}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                  {sub.name}
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
                  Comprehensive modules covering {sub.name} fundamentals and GATE patterns.
                </p>
                <div className="flex items-center text-primary font-bold text-sm">
                  Explore Modules
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-surface">
      {/* Sidebar - Chapter List */}
      <aside 
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 border-r border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col relative`}
      >
        <div className="p-6 border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-primary truncate">
            {subject?.name}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {chapters.length === 0 ? (
            <p className="text-sm text-center text-on-surface-variant py-10 italic">
              No chapters available for this subject.
            </p>
          ) : (
            chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => navigate(`/notes/${subjectSlug}/${ch.id}`)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                  chapterId === ch.id
                    ? 'bg-primary-container text-on-primary-container border-primary/20 shadow-sm'
                    : 'hover:bg-surface-container-low border-transparent'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${
                  ch.user_status === 'done' ? 'text-primary' : 'text-on-surface-variant/40'
                }`}>
                  {ch.user_status === 'done' ? 'check_circle' : 'article'}
                </span>
                <span className="text-sm font-medium line-clamp-1">{ch.title}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-surface-container-lowest">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined">
            {sidebarOpen ? 'menu_open' : 'menu'}
          </span>
        </button>

        <div className="max-w-4xl mx-auto px-6 py-16 md:px-12 md:py-20 animate-fade-in">
          {!chapterId ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
              <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center text-4xl shadow-lg">
                {subject?.icon?.includes("<svg") ? (
                  <div dangerouslySetInnerHTML={{ __html: subject.icon }} className="w-12 h-12" />
                ) : (
                  <span className="material-symbols-outlined text-5xl">
                    {subject?.icon || "school"}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-on-surface mb-2">
                  Welcome to {subject?.name}
                </h1>
                <p className="text-on-surface-variant max-w-md mx-auto">
                  Select a chapter from the sidebar to begin your study session. Each module is optimized for GATE preparation.
                </p>
              </div>
            </div>
          ) : noteLoading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              <p className="text-sm text-on-surface-variant animate-pulse">Retrieving archived knowledge...</p>
            </div>
          ) : (
            <article>
              <header className="mb-12 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                  <span>{subject?.name}</span>
                  <span className="text-on-surface-variant/30">/</span>
                  <span className="text-on-surface-variant/70">Chapter {chapters.findIndex(c => c.id === chapterId) + 1}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface leading-tight">
                  {currentChapter?.title}
                </h1>
              </header>

              <div 
                id="note-content"
                ref={noteContentRef}
                className="gold-note-viewer"
                dangerouslySetInnerHTML={{ __html: noteHtml || "" }}
              />

              <footer className="mt-20 pt-10 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-on-surface-variant text-sm italic">
                  Take your time to synthesize the concepts. Ready for the next one?
                </div>
                <Button
                  onClick={handleMarkAsDone}
                  isLoading={progressSaving}
                  disabled={currentChapter?.user_status === 'done'}
                  className="rounded-full px-10 h-14 text-lg font-bold academic-gradient"
                >
                  {currentChapter?.user_status === 'done' ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined">verified</span>
                      Completed
                    </span>
                  ) : (
                    "Mark as Completed"
                  )}
                </Button>
              </footer>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
