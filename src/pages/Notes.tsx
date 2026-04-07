import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSubjects, fetchChapters, loadNoteHtml, updateNoteProgress } from "../lib/api";
import type { SubjectResponse, ChapterResponse } from "../types";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";

export function Notes() {
  const { subjectSlug, chapterId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [noteHtml, setNoteHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  
  const timeStarted = useRef<number>(Date.now());

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
          console.error("Failed to load chapters:", err);
        }
      }
      loadChapters();
    }
  }, [subjectSlug, subjects]);

  // Load note HTML when chapter changes & track progress
  useEffect(() => {
    if (chapterId && chapterId !== "intro") {
      timeStarted.current = Date.now();
      
      async function loadNote() {
        try {
          setNoteLoading(true);
          const html = await loadNoteHtml(chapterId as string);
          setNoteHtml(html);
          
          // Auto-mark as in_progress after 3 seconds of reading
          const cId = chapterId;
          setTimeout(async () => {
             try {
                if (cId) {
                  await updateNoteProgress({
                     chapter_id: cId,
                     status: "in_progress",
                     time_spent_s: 3
                  });
                }
             } catch (e) { /* ignore */ }
          }, 3000);
          
        } catch (err) {
          console.error("Failed to load note:", err);
          setNoteHtml(
            '<div class="p-8 text-center"><p class="text-on-surface-variant">Notes not available yet</p></div>',
          );
        } finally {
          setNoteLoading(false);
        }
      }
      loadNote();
    } else {
      setNoteHtml(null);
    }
  }, [chapterId]);

  const handleMarkComplete = async () => {
    if (!chapterId) return;
    try {
      setProgressSaving(true);
      const timeSpent = Math.floor((Date.now() - timeStarted.current) / 1000);
      await updateNoteProgress({
        chapter_id: chapterId,
        status: "done",
        time_spent_s: timeSpent
      });
      // Refresh chapters to show checkmark
      const subject = (Array.isArray(subjects) ? subjects : []).find((s) => s.slug === subjectSlug);
      if (subject) {
        const data = await fetchChapters(subject.id);
        setChapters(Array.isArray(data) ? data : []);
      }
      navigate(`/notes/${subjectSlug}/intro`);
    } catch (err) {
      console.error("Failed to mark complete:", err);
    } finally {
      setProgressSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          sync
        </span>
      </div>
    );
  }

  // If viewing a specific note
  if (subjectSlug && chapterId && chapterId !== 'intro') {
    const currentChapter = (Array.isArray(chapters) ? chapters : []).find(c => c.id === chapterId);
    
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in relative pb-32">
        <button
          onClick={() => navigate(`/notes/${subjectSlug}/intro`)}
          className="absolute -top-4 left-6 flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Curriculum
        </button>

        <header className="mt-8 mb-12 text-center">
          <div className="text-xs font-label bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-4">
             {subjectSlug.replace(/-/g, " ")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4 text-on-surface">
            {currentChapter?.title || "The Digital Curator's Notes"}
          </h1>
          <p className="font-notes text-xl italic text-on-surface-variant">
            Critical reflections and deep-dives into the subject matter.
          </p>
        </header>

        <article className="prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none bg-white dark:bg-surface-container-low p-8 md:p-16 rounded-[2rem] shadow-sm border border-outline-variant/10">
          {noteLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-primary/30 animate-spin">
                sync
              </span>
              <p className="text-on-surface-variant">Loading curated content...</p>
            </div>
          ) : noteHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: noteHtml }}
              className="paper-grain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-primary/30">
                import_contacts
              </span>
              <h3 className="text-xl font-bold text-on-surface">
                Access Denied
              </h3>
              <p className="text-on-surface-variant max-w-sm">
                This chapter is not yet curated for the public repository.
              </p>
            </div>
          )}
        </article>

        {/* Completion Bar */}
        {!noteLoading && noteHtml && (
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
              <div className="bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-full shadow-2xl flex items-center justify-between gap-4">
                 <div className="pl-4">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Progress Status</p>
                    <p className="text-sm font-medium">{currentChapter?.user_status === 'done' ? 'Curated & Mastered' : 'Under Synthesis'}</p>
                 </div>
                 <Button 
                    variant={currentChapter?.user_status === 'done' ? "secondary" : "primary"}
                    disabled={progressSaving || currentChapter?.user_status === 'done'}
                    onClick={handleMarkComplete}
                    className="rounded-full px-6"
                 >
                    {progressSaving ? "Syncing..." : currentChapter?.user_status === 'done' ? "Completed" : "Mark Complete"}
                 </Button>
              </div>
           </div>
        )}
      </div>
    );
  }

  // If viewing a subject (show chapters list)
  if (subjectSlug && chapterId === "intro") {
    const subject = (Array.isArray(subjects) ? subjects : []).find((s) => s.slug === subjectSlug);
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to all subjects
        </button>
        <header className="space-y-4 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center text-4xl shadow-lg">
               {subject?.icon || "📚"}
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-on-surface">
                {subject?.name}
              </h2>
              <p className="text-on-surface-variant text-lg font-notes italic">
                {subject?.chapter_count} chapters curated for your intellect.
              </p>
            </div>
          </div>
        </header>
        {chapters.length === 0 ? (
          <EmptyState
            icon="menu_book"
            title="No Chapters Found"
            description="Chapters for this subject are being prepared."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(chapters) ? chapters : []).map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => navigate(`/notes/${subjectSlug}/${chapter.id}`)}
                className="bg-white dark:bg-surface-container-low border border-outline-variant/10 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {chapter.user_status === 'done' && (
                   <div className="absolute top-0 right-0 p-4 text-primary">
                      <span className="material-symbols-outlined font-bold">check_circle</span>
                   </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${chapter.user_status === 'done' ? 'bg-primary text-white' : 'bg-secondary-container text-on-secondary-container'}`}>
                  <span className="material-symbols-outlined">{chapter.user_status === 'done' ? 'verified' : 'article'}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {chapter.title}
                </h3>
                <div className="flex items-center gap-2 mt-4">
                   <div className="h-1.5 flex-1 bg-surface-container rounded-full overflow-hidden">
                      <div 
                         className={`h-full transition-all duration-700 ${chapter.user_status === 'done' ? 'bg-primary w-full' : (chapter.user_status === 'in_progress' ? 'bg-warning w-1/2' : 'w-0')}`}
                      />
                   </div>
                   <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      {chapter.user_status.replace('_', ' ')}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // List all subjects
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
            <div
              key={sub.id}
              onClick={() => navigate(`/notes/${sub.slug}/intro`)}
              className="bg-white dark:bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <span className="material-symbols-outlined text-9xl">{sub.icon || "folder"}</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-2xl">
                  {sub.icon || "folder"}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
                {sub.name}
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                 {sub.chapter_count} Chapters · {sub.progress_pct}% Mastered
              </p>
              <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${sub.progress_pct}%` }}
                 />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
