import { EmptyState } from '../components/ui/EmptyState';

export function Skills() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Skill Analytics</h1>
        <p className="text-on-surface-variant text-lg font-notes italic">The Progress Quill. Track your cognitive strengths.</p>
      </header>
      
      <div className="bg-surface-container-low rounded-[2rem] border border-outline-variant/10 p-12 min-h-[500px] flex items-center justify-center">
         <EmptyState 
           icon="radar" 
           title="Analytics Engine Calibrating" 
           description="Complete more practice sets to generate your neural performance matrix (Recharts radar implementation)."
         />
      </div>
    </div>
  );
}
