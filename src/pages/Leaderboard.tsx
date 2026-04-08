import { useState, useEffect } from "react";
import { fetchLeaderboard } from "../lib/api";
import type { LeaderboardEntry } from "../types";

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<"weekly" | "all_time">("weekly");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeaderboard(scope);
        setLeaderboard((data && data.entries) ? data.entries : []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [scope]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          sync
        </span>
      </div>
    );
  }

  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const topThree = safeLeaderboard.slice(0, 3);
  const restEntries = safeLeaderboard.slice(3);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 mb-8 text-center mt-8">
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">
          The Academic Roster
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic mx-auto max-w-xl">
          A healthy scholarly rivalry among the nation's premier analytical
          minds.
        </p>
      </header>

      <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit mx-auto border border-outline-variant/10">
        {(["weekly", "all_time"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              scope === s
                ? "bg-white dark:bg-surface shadow-sm text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {s === "weekly" ? "Weekly" : "All Time"}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/10 overflow-hidden">
        {/* Top 3 Podiums */}
        {leaderboard.length > 0 ? (
          <div className="bg-surface-container-low p-8 border-b border-outline-variant/10 flex items-end justify-center gap-4 sm:gap-8 min-h-[200px]">
            {/* Rank 2 */}
            {topThree[1] && (
              <div className="flex flex-col items-center pb-4 opacity-90">
                <div className="w-16 h-16 rounded-full bg-secondary-container mb-3 border-4 border-surface shadow-md"></div>
                <div className="font-bold text-sm max-w-[80px] truncate">
                  {topThree[1].name}
                </div>
                <div className="text-xs text-on-surface-variant">
                  {(((topThree[1] as any)?.total_score ?? topThree[1].total_points ?? 0) / 1000).toFixed(1)}k pts
                </div>
                <div className="h-16 w-16 bg-surface-variant rounded-t-lg mt-4 flex items-center justify-center font-display font-bold text-xl text-on-surface-variant">
                  2
                </div>
              </div>
            )}
            {/* Rank 1 */}
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <div className="text-primary mb-2 material-symbols-outlined text-3xl drop-shadow-sm">
                  workspace_premium
                </div>
                <div className="w-20 h-20 rounded-full bg-primary mb-3 border-4 border-surface shadow-lg"></div>
                <div className="font-bold text-primary text-sm max-w-[100px] truncate">
                  {topThree[0].name}
                </div>
                <div className="text-xs text-on-surface-variant font-bold">
                  {(((topThree[0] as any)?.total_score ?? topThree[0].total_points ?? 0) / 1000).toFixed(1)}k pts
                </div>
                <div className="h-24 w-20 bg-primary/10 rounded-t-xl mt-4 flex items-center justify-center font-display font-bold text-3xl text-primary border border-primary/20 border-b-0">
                  1
                </div>
              </div>
            )}
            {/* Rank 3 */}
            {topThree[2] && (
              <div className="flex flex-col items-center pb-4 opacity-80">
                <div className="w-16 h-16 rounded-full bg-tertiary-container mb-3 border-4 border-surface shadow-md"></div>
                <div className="font-bold text-sm max-w-[80px] truncate">
                  {topThree[2].name}
                </div>
                <div className="text-xs text-on-surface-variant">
                  {(((topThree[2] as any)?.total_score ?? topThree[2].total_points ?? 0) / 1000).toFixed(1)}k pts
                </div>
                <div className="h-12 w-16 bg-surface-variant rounded-t-lg mt-4 flex items-center justify-center font-display font-bold text-xl text-on-surface-variant">
                  3
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-on-surface-variant">
              No leaderboard data available
            </p>
          </div>
        )}

        {/* List */}
        {restEntries.length > 0 && (
          <div className="p-4 space-y-2">
            {restEntries?.map((entry, idx) => (
              <div
                key={entry.user_id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 flex justify-center font-display text-on-surface-variant font-bold">
                    {idx + 4}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-container-high"></div>
                  <div className="font-medium text-on-surface truncate">
                    {entry.name}
                  </div>
                </div>
                <div className="font-mono text-sm text-on-surface-variant">
                  {(((entry as any)?.total_score ?? entry.total_points ?? 0) / 1000).toFixed(1)}k pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
