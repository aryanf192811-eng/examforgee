import { useEffect } from 'react';

/**
 * Platform security hook — debugger trap pattern.
 * Standard DevTools detection via debugger statement.
 * 
 * Call this ONCE in App.tsx.
 */
export function usePlatformSecurity(): void {
  useEffect(() => {
    if (import.meta.env.DEV) return;

    const interval = setInterval(() => {
      // eslint-disable-next-line no-debugger
      debugger;
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
