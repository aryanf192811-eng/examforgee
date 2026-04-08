import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import type { SubjectResponse } from '../../types';

interface SubjectMasteryChartProps {
  subjects: SubjectResponse[];
}

export function SubjectMasteryChart({ subjects }: SubjectMasteryChartProps) {
  const data = (subjects ?? []).slice(0, 8).map((s) => ({
    subject: s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name,
    mastery: s.progress_pct ?? 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-body-md text-on-surface-variant">
        No subjects available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid
          stroke="var(--color-surface-variant)"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
        />
        <Radar
          dataKey="mastery"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
