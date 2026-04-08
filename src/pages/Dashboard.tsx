import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap';
import { SubjectMasteryChart } from '../components/dashboard/SubjectMasteryChart';
import { StudyVelocityChart } from '../components/dashboard/StudyVelocityChart';
import { useAuthStore } from '../lib/store/authStore';
import { getSubjects, getProgress } from '../lib/api';
import { formatNumber, formatPercent, safeNum } from '../lib/utils';
import type { SubjectResponse } from '../types';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const [subjectsData] = await Promise.allSettled([
          getSubjects(),
        ]);
        if (cancelled) return;
        if (subjectsData.status === 'fulfilled') setSubjects(subjectsData.value ?? []);
      } catch {
        // Errors handled by individual promise results
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const userName = user?.name || 'Student';
  const streakDays = safeNum(user?.current_streak);
  const totalPoints = safeNum(user?.total_points);
  const accuracy = safeNum(user?.accuracy_pct);
  const studyTimeHours = safeNum(user?.study_hours);
  const chaptersCompleted = safeNum(user?.chapters_completed);

  return (
    <AppShell title="Dashboard">
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton variant="card" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rect" className="h-24 rounded-2xl" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </div>
      ) : (
        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-6"
        >
          {/* ── Welcome Card ── */}
          <motion.div
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative rounded-2xl bg-surface-container p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 gradient-cta opacity-5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h2 className="font-display text-headline-md text-on-surface mb-1">
                Welcome back, {userName}
              </h2>
              <p className="text-body-md text-on-surface-variant mb-4">
                Continue your GATE preparation journey
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="primary" icon="local_fire_department">
                  {streakDays} day streak
                </Badge>
                <Badge variant="secondary" icon="trophy">
                  {formatNumber(totalPoints)} points
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* ── Stats Grid ── */}
          <motion.div
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatCard
              icon="help_outline"
              label="Quizzes"
              value={formatNumber(user?.quizzes_taken)}
            />
            <StatCard
              icon="target"
              label="Accuracy"
              value={formatPercent(accuracy)}
            />
            <StatCard
              icon="schedule"
              label="Study Time"
              value={`${Math.floor(studyTimeHours)}h ${Math.round((studyTimeHours % 1) * 60)}m`}
            />
            <StatCard
              icon="school"
              label="Chapters"
              value={formatNumber(chaptersCompleted)}
            />
          </motion.div>

          {/* ── Charts Row ── */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-2xl bg-surface-container p-5"
            >
              <h3 className="font-headline text-title-lg text-on-surface mb-4">
                Subject Mastery
              </h3>
              <SubjectMasteryChart subjects={subjects} />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-2xl bg-surface-container p-5"
            >
              <h3 className="font-headline text-title-lg text-on-surface mb-4">
                Study Velocity
              </h3>
              <StudyVelocityChart sessions={user?.study_sessions} />
            </motion.div>
          </div>

          {/* ── Activity Heatmap ── */}
          <motion.div
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="rounded-2xl bg-surface-container p-5"
          >
            <h3 className="font-headline text-title-lg text-on-surface mb-4">
              Activity
            </h3>
            <ActivityHeatmap data={user?.activity_logs} />
          </motion.div>

          {/* ── Quick Actions ── */}
          <motion.div
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon="menu_book"
              onClick={() => navigate('/notes')}
            >
              Continue Notes
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon="quiz"
              onClick={() => navigate('/practice')}
            >
              Start Quiz
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon="style"
              onClick={() => navigate('/skills')}
            >
              Review Flashcards
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-container p-4 flex flex-col gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">
        {icon}
      </span>
      <span className="font-display text-headline-sm text-on-surface">{value}</span>
      <span className="text-label-md text-on-surface-variant">{label}</span>
    </div>
  );
}
