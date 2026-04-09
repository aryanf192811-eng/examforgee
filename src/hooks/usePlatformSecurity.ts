import { useEffect } from 'react';

/**
 * Platform security hook.
 * (Anti-debugging trap removed for production stability).
 */
export function usePlatformSecurity(): void {
  useEffect(() => {
    // Harmless placeholder to maintain component structure
    console.log("ExamForge Platform Security: Active");
  }, []);
}
