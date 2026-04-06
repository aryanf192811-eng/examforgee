import { useEffect } from 'react';

export function usePlatformSecurity() {
  useEffect(() => {
    if (import.meta.env.DEV) return; // Skip in development

    const trap = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - start > 100) {
        document.body.innerHTML = '';
        window.location.href = '/';
      }
    };
    const interval = setInterval(trap, 1000);
    return () => clearInterval(interval);
  }, []);
}
