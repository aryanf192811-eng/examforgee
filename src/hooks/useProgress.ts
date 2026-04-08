import { useState, useEffect } from 'react';
import { getProgress } from '../lib/api';
import type { ProfileResponse } from '../types';

/**
 * Hook for fetching user progress/stats.
 * All stat fields are null-coalesced in the consuming components.
 */
export function useProgress() {
  const [stats, setStats] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProgress();
        if (!cancelled) {
          setStats(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load progress');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, isLoading, error };
}
