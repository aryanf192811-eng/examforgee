import { useEffect } from 'react';

/**
 * Platform security hook — debugger trap pattern.
 * Standard DevTools detection via debugger statement.
 * NOT dimension polling (which is banned per the rules).
 *
 * Call this ONCE in App.tsx useEffect.
 */
export function usePlatformSecurity(): void {
  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line no-debugger
      debugger;
    }, 100);

    return () => clearInterval(interval);
  }, []);
}
