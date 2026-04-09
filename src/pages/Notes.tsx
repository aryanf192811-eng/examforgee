import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  fetchSubjects, 
  fetchChapters, 
  loadNoteHtml, 
  updateUserProgress, 
  fetchUserProgress 
} from "../lib/api";
import type { Subject, Chapter, UserProgress } from "../types";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";

export function Notes() {
  const { subjectSlug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [noteHtml, setNoteHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("500px");
  
  const timeStarted = useRef<number>(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const [subs, prog] = await Promise.all([
          fetchSubjects(),
          fetchUserProgress()
        ]);
        setSubjects(subs);
        setUserProgress(prog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Load chapters when subjectSlug changes
  useEffect(() => {
    if (subjectSlug && subjectSlug !== "intro") {
      async function loadChapters() {
        try {
          const data = await fetchChapters(subjectSlug);
          setChapters(data);
        } catch (err) {
          console.error(err);
          setChapters([]);
        }
      }
      loadChapters();
    }
  }, [subjectSlug]);

  // Load note content when chapterSlug changes
  useEffect(() => {
    const currentChapter = chapters.find(c => c.slug === chapterSlug);
    if (currentChapter && currentChapter.notes_file) {
      async function fetchNote() {
        setNoteLoading(true);
        try {
          const html = await loadNoteHtml(currentChapter!.notes_file!);
          setNoteHtml(html);
          timeStarted.current = Date.now();
        } catch (err) {
          console.error(err);
          setNoteHtml("<p style='color: red;'>Failed to load note content.</p>");
        } finally {
          setNoteLoading(false);
        }
      }
      fetchNote();
    } else {
      setNoteHtml(null);
    }
  }, [chapterSlug, chapters]);

  const updateIframeHeight = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const body = iframeRef.current.contentWindow.document.body;
      const html = iframeRef.current.contentWindow.document.documentElement;
      if (body && html) {
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        setIframeHeight(`${height}px`);
      }
    }
  };

  useEffect(() => {
    if (!iframeRef.current) return;
    const observer = new ResizeObserver(() => updateIframeHeight());
    const iframe = iframeRef.current;
    const handleLoad = () => {
      updateIframeHeight();
      if (iframe.contentWindow) {
        observer.observe(iframe.contentWindow.document.body);
      }
    };
    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
      observer.disconnect();
    };
  }, [noteHtml]);

  const handleMarkAsDone = async () => {
    const currentChapter = chapters.find(c => c.slug === chapterSlug);
    if (!currentChapter || !subjectSlug) return;
    
    const subject = subjects.find(s => s.slug === subjectSlug);
    if (!subject) return;

    setProgressSaving(true);
    try {
      const timeSpent = Math.floor((Date.now() - timeStarted.current) / 1000);
      await updateUserProgress({
        chapter_slug: currentChapter.slug,
        subject_id: subject.id,
        progress_pct: 100,
        time_spent_s: timeSpent,
        completed: true
      });
      
      // Refresh progress
      const newProg = await fetchUserProgress(subject.id);
      setUserProgress(newProg);
    } catch (err) {
      console.error(err);
    } finally {
      setProgressSaving(false);
    }
  };

  const currentSubject = subjects.find(s => s.slug === subjectSlug);
  const currentChapter = chapters.find(c => c.slug === chapterSlug);
  const isCompleted = userProgress.some(p => p.chapter_slug === chapterSlug && p.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subjectSlug || subjectSlug === "intro") {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
        <header className="space-y-4 mb-12 text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-on-surface text-transparent bg-clip-text academic-gradient">
            Curriculum Repository
          </h1>
          <p className="text-on-surface-variant text-lg font-notes italic">
            Select a discipline to begin your ideological synthesis.
          </p>
        </header>

        {subjects.length === 0 ? (
          <EmptyState icon="menu_book" title="No Subjects Found" description="The curriculum is currently being updated." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/notes/${sub.slug}`}
                className="group relative bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-3xl">{sub.icon || "receipt_long"}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">{sub.name}</h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{sub.description || `Comprehensive modules covering ${sub.name}.`}</p>
                <div className="flex items-center text-primary font-bold text-sm">
                  Explore Modules <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col relative`}>
        <div className="p-6 border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-primary truncate">{currentSubject?.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {chapters.length === 0 ? (
            <p className="text-sm text-center text-on-surface-variant py-10 italic">No chapters available.</p>
          ) : (
            chapters.map((ch) => {
              const chDone = userProgress.some(p => p.chapter_slug === ch.slug && p.completed);
              return (
                <button
                  key={ch.id}
                  onClick={() => navigate(`/notes/${subjectSlug}/${ch.slug}`)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                    chapterSlug === ch.slug ? 'bg-primary-container text-on-primary-container border-primary/20 shadow-sm' : 'hover:bg-surface-container-low border-transparent'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${chDone ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                    {chDone ? 'check_circle' : 'article'}
                  </span>
                  <span className="text-sm font-medium line-clamp-1">{ch.title}</span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-surface-container-lowest custom-scrollbar">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-20 left-6 z-10 w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">{sidebarOpen ? 'menu_open' : 'menu'}</span>
        </button>

        <div className="max-w-4xl mx-auto px-6 py-16 md:px-12 md:py-20 animate-fade-in">
          {!chapterSlug ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
              <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center text-4xl shadow-lg">
                <span className="material-symbols-outlined text-5xl">{currentSubject?.icon || "school"}</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-on-surface mb-2">Welcome to {currentSubject?.name}</h1>
              <p className="text-on-surface-variant max-w-md mx-auto">Select a chapter from the sidebar to begin your study session.</p>
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
                  <span>{currentSubject?.name}</span>
                  <span className="text-on-surface-variant/30">/</span>
                  <span className="text-on-surface-variant/70">Module</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface leading-tight">{currentChapter?.title}</h1>
              </header>

              {noteHtml && (
                <div className="relative w-full overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1">
                          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
                          <style>
                            :root { color-scheme: light dark; --primary: #6750a4; }
                            body { font-family: -apple-system, sans-serif; line-height: 1.8; color: inherit; margin: 0; padding: 2rem; font-size: 1.1rem; overflow: hidden; }
                            img { max-width: 100%; height: auto; border-radius: 12px; }
                            table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
                            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                            code { background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px; font-family: monospace; }
                          </style>
                        </head>
                        <body style="background: transparent;">
                          ${noteHtml}
                          <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
                          <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
                          <script>
                            window.onload = () => {
                              renderMathInElement(document.body, {
                                delimiters: [
                                  { left: "$$", right: "$$", display: true },
                                  { left: "$", right: "$", display: false }
                                ],
                                throwOnError: false
                              });
                            }
                          </script>
                        </body>
                      </html>
                    `}
                    style={{ height: iframeHeight, width: '100%', border: 'none' }}
                    scrolling="no"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              )}

              <footer className="mt-20 pt-10 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6">
                <Button onClick={handleMarkAsDone} isLoading={progressSaving} disabled={isCompleted} className="rounded-full px-10 h-14 text-lg font-bold academic-gradient">
                  {isCompleted ? "Completed" : "Mark as Completed"}
                </Button>
              </footer>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
