export function Leaderboard() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 mb-8 text-center mt-8">
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">The Academic Roster</h1>
        <p className="text-on-surface-variant text-lg font-notes italic mx-auto max-w-xl">
          A healthy scholarly rivalry among the nation's premier analytical minds.
        </p>
      </header>

      <div className="max-w-3xl mx-auto bg-white dark:bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/10 overflow-hidden">
        {/* Top 3 Podiums concept */}
        <div className="bg-surface-container-low p-8 border-b border-outline-variant/10 flex items-end justify-center gap-4 sm:gap-8 min-h-[200px]">
           {/* Rank 2 */}
           <div className="flex flex-col items-center pb-4 opacity-90">
             <div className="w-16 h-16 rounded-full bg-secondary-container mb-3 border-4 border-surface shadow-md"></div>
             <div className="font-bold">Rahul M.</div>
             <div className="text-xs text-on-surface-variant">14.2k pts</div>
             <div className="h-16 w-16 bg-surface-variant rounded-t-lg mt-4 flex items-center justify-center font-display font-bold text-xl text-on-surface-variant">2</div>
           </div>
           {/* Rank 1 */}
           <div className="flex flex-col items-center">
             <div className="text-primary mb-2 material-symbols-outlined text-3xl drop-shadow-sm">workspace_premium</div>
             <div className="w-20 h-20 rounded-full bg-primary mb-3 border-4 border-surface shadow-lg"></div>
             <div className="font-bold text-primary">Aditi V.</div>
             <div className="text-xs text-on-surface-variant font-bold">18.5k pts</div>
             <div className="h-24 w-20 bg-primary/10 rounded-t-xl mt-4 flex items-center justify-center font-display font-bold text-3xl text-primary border border-primary/20 border-b-0">1</div>
           </div>
           {/* Rank 3 */}
           <div className="flex flex-col items-center pb-4 opacity-80">
             <div className="w-16 h-16 rounded-full bg-tertiary-container mb-3 border-4 border-surface shadow-md"></div>
             <div className="font-bold">Zaid K.</div>
             <div className="text-xs text-on-surface-variant">12.8k pts</div>
             <div className="h-12 w-16 bg-surface-variant rounded-t-lg mt-4 flex items-center justify-center font-display font-bold text-xl text-on-surface-variant">3</div>
           </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-2">
          {[4, 5, 6, 7, 8].map((rank) => (
            <div key={rank} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center font-display text-on-surface-variant">{rank}</div>
                <div className="w-10 h-10 rounded-full bg-surface-container-high"></div>
                <div className="font-medium text-on-surface">Curator #{rank}20{rank}</div>
              </div>
              <div className="font-mono text-sm text-on-surface-variant">{10 - rank}.{rank}k pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
