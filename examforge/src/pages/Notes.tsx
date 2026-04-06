import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSubjects } from '../lib/api';
import type { SubjectResponse } from '../types';
import { EmptyState } from '../components/ui/EmptyState';

export function Notes() {
  const { subjectSlug, chapterId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
      </div>
    );
  }

  // If viewing a specific note
  if (subjectSlug && chapterId) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in relative">
        <button 
          onClick={() => navigate('/notes')} 
          className="absolute -top-4 left-6 flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Curriculum
        </button>
        
        <header className="mt-8 mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4 text-on-surface">
            The Digital Curator's Notes
          </h1>
          <p className="font-notes text-xl italic text-on-surface-variant">
            A comprehensive editorial on {subjectSlug.replace(/-/g, ' ')}.
          </p>
        </header>

        <article className="prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none bg-white dark:bg-surface-container-low p-8 md:p-16 rounded-[2rem] shadow-sm border border-outline-variant/10">
           {/* In Phase 4 we will integrate the actual CDN NotesViewer here */}
           <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <span className="material-symbols-outlined text-6xl text-primary/30">import_contacts</span>
             <h3 className="text-xl font-bold text-on-surface">Notes Viewer Ready</h3>
             <p className="text-on-surface-variant max-w-sm">The CDN-direct markdown rendering pipeline will be integrated into this viewer pane.</p>
           </div>
        </article>
      </div>
    );
  }

  // List all subjects
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <header className="space-y-2 mb-12">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Curriculum</h1>
        <p className="text-on-surface-variant text-lg font-notes italic">Select a discipline to begin reading.</p>
      </header>

      {subjects.length === 0 ? (
        <EmptyState 
          icon="menu_book" 
          title="No Subjects Found" 
          description="The curriculum is currently being updated. Please check back later." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(sub => (
            <div 
              key={sub.id} 
              onClick={() => navigate(`/notes/${sub.slug}/intro`)}
              className="bg-white dark:bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{sub.icon || 'folder'}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                {sub.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
