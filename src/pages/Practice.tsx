import { useState } from 'react';
import { Button } from '../components/ui/Button';

export function Practice() {
  const [activeTab, setActiveTab] = useState<'daily'|'subjects'|'mocks'>('daily');

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Practice Arena</h1>
        <p className="text-on-surface-variant text-lg font-notes italic">Sharpen your intellect under exam conditions.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit border border-outline-variant/10">
        {(['daily', 'subjects', 'mocks'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-surface shadow-sm text-primary' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'daily' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <span className="material-symbols-outlined text-[120px]">local_fire_department</span>
            </div>
            <div className="p-3 bg-primary w-fit text-white rounded-xl mb-6 shadow-md shadow-primary/20">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3 text-on-surface">Daily Sprint</h2>
            <p className="text-on-surface-variant mb-8 max-w-md">A focused 15-minute mock test covering mixed topics to keep your problem-solving reflexes sharp.</p>
            <Button variant="primary" className="rounded-full px-8 py-6 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">
              Start Synthesis
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">account_tree</span>
          <h3 className="text-xl font-bold text-on-surface">Subject Modules Pending</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto mt-2">API connections for direct Quiz components will be wired in Phase 5.</p>
        </div>
      )}

      {activeTab === 'mocks' && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">fact_check</span>
          <h3 className="text-xl font-bold text-on-surface">Full Length Mocks Locked</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto mt-2">Pro subscription required to access the complete editorial mock curriculum.</p>
        </div>
      )}
    </div>
  );
}
