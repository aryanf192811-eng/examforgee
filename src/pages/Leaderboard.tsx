import { useState, useEffect } from "react";
import { fetchLeaderboard, fetchMyRank } from "../lib/api";
import type { LeaderboardEntry } from "../types";

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [data, rankData] = await Promise.all([
          fetchLeaderboard(50),
          fetchMyRank()
        ]);
        setLeaderboard(data);
        setMyRank(rankData.rank);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restEntries = leaderboard.slice(3);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 text-center mt-12">
        <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-on-surface text-transparent bg-clip-text academic-gradient">
          The Academic Roster
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic mx-auto max-w-xl">
          A healthy scholarly rivalry among the nation's premier analytical minds.
        </p>
      </header>

      {/* Podium Visualization */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4">
        {/* Rank 2 */}
        {topThree[1] && (
          <div className="order-2 md:order-1 flex flex-col items-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-high border-4 border-outline-variant/20 shadow-xl overflow-hidden flex items-center justify-center text-3xl text-on-surface-variant font-bold">
                 {topThree[1].name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold border-2 border-surface">2</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-on-surface">{topThree[1].name}</div>
              <div className="text-primary font-mono font-bold">{topThree[1].score.toLocaleString()} pts</div>
            </div>
            <div className="w-full h-32 bg-surface-container/50 rounded-t-3xl mt-6 border-t border-x border-outline-variant/10"></div>
          </div>
        )}

        {/* Rank 1 */}
        {topThree[0] && (
          <div className="order-1 md:order-2 flex flex-col items-center group">
             <div className="material-symbols-outlined text-5xl text-warning mb-4 animate-bounce">workspace_premium</div>
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-primary-container border-4 border-primary/30 shadow-2xl overflow-hidden flex items-center justify-center text-5xl text-primary font-bold">
                 {topThree[0].name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold border-4 border-surface shadow-lg">1</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-on-surface">{topThree[0].name}</div>
              <div className="text-primary font-mono font-bold text-xl">{topThree[0].score.toLocaleString()} pts</div>
            </div>
            <div className="w-full h-44 bg-primary/5 rounded-t-3xl mt-6 border-t border-x border-primary/20"></div>
          </div>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <div className="order-3 flex flex-col items-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-high border-4 border-outline-variant/20 shadow-xl overflow-hidden flex items-center justify-center text-3xl text-on-surface-variant font-bold">
                 {topThree[2].name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold border-2 border-surface">3</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-on-surface">{topThree[2].name}</div>
              <div className="text-primary font-mono font-bold">{topThree[2].score.toLocaleString()} pts</div>
            </div>
            <div className="w-full h-24 bg-surface-container/30 rounded-t-3xl mt-6 border-t border-x border-outline-variant/10"></div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* My Rank Placeholder */}
        {myRank && myRank > 50 && (
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 flex items-center justify-between shadow-lg shadow-primary/5 mb-8">
            <div className="flex items-center gap-6">
               <div className="w-10 text-center font-mono font-bold text-primary text-xl">#{myRank}</div>
               <div className="font-bold text-on-surface">Your Current Standing</div>
            </div>
            <div className="text-on-surface-variant italic text-sm">Keep synthesizing to climb higher.</div>
          </div>
        )}

        {/* Regular List */}
        <div className="bg-surface-container-low rounded-[2.5rem] p-4 border border-outline-variant/10 overflow-hidden shadow-sm">
          {restEntries.map((entry, idx) => (
            <div key={entry.user_id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-surface-container transition-all group">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-10 text-center font-mono text-on-surface-variant font-bold text-lg group-hover:text-primary transition-colors">
                  {idx + 4}
                </div>
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant border border-outline-variant/10">
                  {entry.name.charAt(0)}
                </div>
                <div className="font-bold text-lg text-on-surface">{entry.name}</div>
              </div>
              <div className="font-mono text-primary font-bold">
                {entry.score.toLocaleString()} <span className="text-[10px] uppercase opacity-50 ml-1">pts</span>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="p-20 text-center">
               <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">analytics</span>
               <p className="text-on-surface-variant italic">The roster is being regenerated...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
