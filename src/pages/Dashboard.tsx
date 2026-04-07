import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { fetchSubjects, fetchProfile } from "../lib/api";
import type { SubjectResponse, UserProfile } from "../types";
import { ProgressBar } from "../components/ui/ProgressBar";

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [subjectsData, profileData] = await Promise.all([
          fetchSubjects(),
          fetchProfile(),
        ]);
        setSubjects(subjectsData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calculate overall mastery from top 3 subjects by progress
  const topSubjects = (Array.isArray(subjects) ? subjects : [])
    .filter((s) => s.is_published)
    .sort((a, b) => b.progress_pct - a.progress_pct)
    .slice(0, 3);
  
  const overallMastery =
    topSubjects.length > 0
      ? Math.round(
          topSubjects.reduce((acc, s) => acc + s.progress_pct, 0) /
            topSubjects.length,
        )
      : 0;

  const continueSubject = (Array.isArray(subjects) ? subjects : [])
    .filter(s => s.progress_pct > 0 && s.progress_pct < 100)
    .sort((a, b) => b.progress_pct - a.progress_pct)[0] || (Array.isArray(subjects) ? subjects[0] : undefined);

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-6xl text-primary/30">sync</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">
          Welcome back, {profile?.name || user?.displayName || "Curator"}.
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic">
          You've completed {overallMastery}% of your main focus areas.{" "}
          {overallMastery >= 75 ? "Excellent progress!" : "Keep pushing!"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main large stat card */}
        <div className="md:col-span-8 bg-white dark:bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">
                Curriculum Mastery
              </h2>
              <div className="font-display text-5xl font-bold flex items-baseline gap-2 text-on-surface">
                {overallMastery}
                <span className="text-2xl text-on-surface-variant">%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary font-display text-2xl font-bold">
                {profile?.total_points || 0}
              </div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label">Pts Earned</div>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {topSubjects?.map((subject) => (
              <div key={subject.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-on-surface">
                    {subject.name}
                  </span>
                  <span className="text-on-surface-variant text-xs">
                    {subject.completed_chapters} / {subject.chapter_count} chapters
                  </span>
                </div>
                <ProgressBar value={subject.progress_pct} />
              </div>
            ))}
            {topSubjects.length === 0 && (
              <p className="text-on-surface-variant font-notes italic">Start your journey by selecting a subject from the curriculum.</p>
            )}
          </div>
        </div>

        {/* Weekly Strike */}
        <div className="md:col-span-4 bg-surface-container-high dark:bg-surface-container rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">local_fire_department</span>
           </div>
          <div>
            <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-6">
              Active Streak
            </h2>
            <div className="font-display text-7xl font-bold text-primary mb-2 flex items-baseline gap-2">
              {profile?.current_streak || 0}
              <span className="material-symbols-outlined text-4xl animate-pulse text-warning">local_fire_department</span>
            </div>
            <p className="text-on-surface-variant font-medium">Consecutive units of study</p>
          </div>
          <div className="flex gap-2 mt-8">
            {(Array.isArray(["M", "T", "W", "T", "F", "S", "S"]) ? ["M", "T", "W", "T", "F", "S", "S"] : []).map((day, i) => {
              const active = (profile?.current_streak || 0) > (6 - i);
              return (
                <div
                  key={i}
                  className={`flex-1 aspect-[1/2] rounded-full flex items-center justify-center text-xs font-bold transition-all duration-700 ${active ? "bg-primary text-white academic-gradient shadow-sm scale-110" : "bg-surface-variant text-on-surface-variant"}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Learning */}
        <div
          className="md:col-span-6 bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm cursor-pointer hover:border-primary/30 transition-all group"
          onClick={() => navigate("/notes")}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Resume Editorial</h3>
              <p className="text-sm text-on-surface-variant">
                {continueSubject?.name || "Curriculum"}
              </p>
            </div>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface leading-snug group-hover:text-primary transition-colors">
            {continueSubject ? `Continue your progress in ${continueSubject.name} chapters.` : "Start your first chapter in the curriculum."}
          </p>
        </div>

        {/* Recommended Practice */}
        <div
          className="md:col-span-6 bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm cursor-pointer hover:border-secondary/30 transition-all group"
          onClick={() => navigate("/practice")}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">quiz</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Synthesis Drill</h3>
              <p className="text-sm text-on-surface-variant">
                Recommended for you
              </p>
            </div>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface leading-snug group-hover:text-secondary transition-colors">
            Take a mixed-topic Daily Sprint to solidify your retention.
          </p>
        </div>
      </div>
    </div>
  );
}
