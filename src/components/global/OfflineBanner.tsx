import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OfflineBanner — shows a banner when the user goes offline.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-error-container text-on-error-container px-4 py-2.5 flex items-center justify-center gap-2 text-label-lg"
        >
          <span className="material-symbols-outlined text-[18px]">
            cloud_off
          </span>
          You are currently offline. Some features may be unavailable.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
