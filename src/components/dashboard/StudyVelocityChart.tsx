import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StudySession {
  date: string;
  duration_min: number;
}

interface StudyVelocityChartProps {
  sessions?: StudySession[];
}

export function StudyVelocityChart({ sessions = [] }: StudyVelocityChartProps) {
  const data = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      
      const session = sessions.find(s => s.date === dateStr);
      result.push({
        day: dayName,
        minutes: session?.duration_min ?? 0,
      });
    }
    return result;
  }, [sessions]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="velocity-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface-container-high)',
            border: 'none',
            borderRadius: '12px',
            color: 'var(--color-on-surface)',
            fontSize: '13px',
          }}
          labelStyle={{ color: 'var(--color-on-surface-variant)' }}
        />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke="var(--color-secondary)"
          strokeWidth={2}
          fill="url(#velocity-gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
