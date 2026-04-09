import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { fetchSubjects, fetchProfile, fetchUserProgress } from "../lib/api";
import type { Subject, UserProfile, UserProgress } from "../types";
import { ProgressBar } from "../components/ui/ProgressBar";

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [subs, prof, prog] = await Promise.all([
          fetchSubjects(),
          fetchProfile(),
          fetchUserProgress()
        ]);
        setSubjects(subs);
        setProfile(prof);
        setUserProgress(prog);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calculate subject-wise progress by merging userProgress with subjects
  const subjectsWithProgress = subjects.map(s => {
    const relevantProgress = userProgress.filter(p => p.subject_id === s.id);
    const completedCount = relevantProgress.filter(p => p.completed).length;
    const progressPct = s.chapter_count > 0 ? (completedCount / s.chapter_count) * 100 : 0;
    
    return {
      ...s,
      completed_chapters: completedCount,
      progress_pct: Math.round(progressPct)
    };
  });

  const topSubjects = [...subjectsWithProgress]
    .sort((a, b) => b.progress_pct - a.progress_pct)
    .slice(0, 3);
  
  const overallMastery =
    topSubjects.length > 0
      ? Math.round(topSubjects.reduce((acc, s) => acc + s.progress_pct, 0) / topSubjects.length)
      : 0;

  const continueSubject = subjectsWithProgress
    .filter(s => s.progress_pct > 0 && s.progress_pct < 100)
    .sort((a, b) => b.progress_pct - a.progress_pct)[0] || subjectsWithProgress[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <header className="space-y-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
          Greetings, <span className="text-transparent bg-clip-text academic-gradient">{profile?.name || user?.displayName || "Agent"}</span>.
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic">
          Your current curriculum mastery is at {overallMastery}%. {overallMastery > 50 ? "Progressing towards target." : "Initiating study modules."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Mastery Card */}
        <div className="md:col-span-8 bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h2 className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3 font-bold">Curriculum Synthesis State</h2>
              <div className="font-display text-6xl font-bold flex items-baseline gap-2 text-on-surface">
                {overallMastery}<span className="text-2xl text-on-surface-variant">%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary font-display text-3xl font-bold">{profile?.total_points || 0}</div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label font-bold">Total Pts</div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {topSubjects.length > 0 ? topSubjects.map((subject) => (
              <div key={subject.id}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-bold text-on-surface">{subject.name}</span>
                  <span className="text-on-surface-variant text-xs font-mono">{subject.completed_chapters} / {subject.chapter_count} Modules</span>
                </div>
                <ProgressBar value={subject.progress_pct} />
              </div>
            )) : (
              <p className="text-on-surface-variant font-notes italic py-4">No subjects found in curriculum.</p>
            )}
          </div>
        </div>

        {/* Streak & Points */}
        <div className="md:col-span-4 bg-surface-container-low rounded-[2.5rem] p-8 flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-700">
            <span className="material-symbols-outlined text-[140px]">local_fire_department</span>
          </div>
          <div>
            <h2 className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-6 font-bold">Current Pulse</h2>
            <div className="font-display text-7xl font-bold text-primary mb-2 flex items-baseline gap-3">
              {profile?.current_streak || 0}
              <span className="material-symbols-outlined text-4xl text-warning animate-pulse">local_fire_department</span>
            </div>
            <p className="text-on-surface-variant font-medium">Day Intensity Level</p>
          </div>
          <div className="flex gap-2 mt-10">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const active = (profile?.current_streak || 0) > (6 - i);
              return (
                <div key={i} className={`flex-1 aspect-[1/2.5] rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${active ? "bg-primary text-white academic-gradient shadow-lg scale-110" : "bg-surface-variant/30 text-on-surface-variant"}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Cards */}
        <div onClick={() => navigate("/notes")} className="md:col-span-6 bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 cursor-pointer hover:border-primary/30 transition-all group hover:shadow-xl">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface">Resume Editorial</h3>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface-variant leading-relaxed mb-4 italic">
            "{continueSubject ? `Ready to synthesize the next chapter in ${continueSubject.name}?` : "The curriculum awaits your first interaction."}"
          </p>
          <div className="flex items-center text-primary font-bold">
            Continue Journey <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-2">arrow_forward</span>
          </div>
        </div>

        <div onClick={() => navigate("/practice")} className="md:col-span-6 bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 cursor-pointer hover:border-secondary/30 transition-all group hover:shadow-xl">
           <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface">Stress Test</h3>
          </div>
          <p className="font-notes text-xl font-medium text-on-surface-variant leading-relaxed mb-4 italic">
            "Validate your pattern recognition with a randomized Daily Sprint."
          </p>
           <div className="flex items-center text-secondary font-bold">
            Commence Drilling <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-2">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
}
