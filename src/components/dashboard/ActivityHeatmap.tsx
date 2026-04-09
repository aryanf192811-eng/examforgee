import { useMemo } from 'react';

/**
 * ActivityHeatmap — 53 weeks × 7 days contribution grid.
 * Maps real activity_logs data from the profile.
 */
interface ActivityHeatmapProps {
  data?: Record<string, number>;
}

export function ActivityHeatmap({ data = {} }: ActivityHeatmapProps) {
  const cells = useMemo(() => {
    const today = new Date();
    // Start from the Sunday of 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const grid: number[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 53 * 7; i++) {
       const dateStr = current.toISOString().split('T')[0];
       grid.push(data[dateStr] ?? 0);
       current.setDate(current.getDate() + 1);
    }
    return grid;
  }, [data]);

  const intensityClasses = [
    'bg-surface-container',
    'bg-primary/20',
    'bg-primary/50',
    'bg-primary',
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px]" style={{ minWidth: 'max-content' }}>
        {Array.from({ length: 53 }).map((_, week) => (
          <div key={week} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, day) => {
              const idx = week * 7 + day;
              const level = Math.min(cells[idx] ?? 0, 3); // Cap at 3 for safety
              return (
                <div
                  key={day}
                  className={`w-[11px] h-[11px] rounded-[2px] ${intensityClasses[level]} transition-colors`}
                  title={`Level ${level}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-label-sm text-on-surface-variant">Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${cls}`} />
        ))}
        <span className="text-label-sm text-on-surface-variant">More</span>
      </div>
    </div>
  );
}
