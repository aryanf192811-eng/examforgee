import { useState, useEffect } from 'react';
import { fetchProgress } from '../lib/api';
import type { UserProgressResponse } from '../types';
import { useToastStore } from '../lib/utils';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => addToast('error', 'Failed to load progress'))
      .finally(() => setIsLoading(false));
  }, [addToast]);

  return { progress, isLoading };
}
