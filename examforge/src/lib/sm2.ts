// SM-2 Spaced Repetition Algorithm
// Used client-side for optimistic UI updates; server is source of truth

export interface SM2Result {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
}

export function calculateSM2(
  quality: number, // 0-5
  prevEaseFactor: number,
  prevInterval: number,
  prevRepetitions: number
): SM2Result {
  const clampedQuality = Math.max(0, Math.min(5, quality));

  let easeFactor = prevEaseFactor + (0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  let interval: number;
  let repetitions: number;

  if (clampedQuality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions = prevRepetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * easeFactor);
    }
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ease_factor: easeFactor,
    interval,
    repetitions,
    next_review: nextDate.toISOString(),
  };
}
