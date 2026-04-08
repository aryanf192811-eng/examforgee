import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../lib/store/modalStore';
import { cn } from '../../lib/utils';

export function ScholarlyUpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal } = useModalStore();

  return (
    <AnimatePresence>
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeUpgradeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-surface-container-high p-8 shadow-2xl border border-primary/10"
          >
            {/* Premium Gradient Background */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px] text-primary">
                  workspace_premium
                </span>
              </div>

              <h2 className="font-display text-headline-md text-on-surface mb-3">
                Scholarly Upgrade
              </h2>
              
              <div className="p-6 rounded-2xl bg-surface-container mb-6 border border-primary/5">
                <p className="text-body-lg text-on-surface leading-relaxed italic font-serif">
                  "The Premium Tier is currently in Early Access for top-ranking scholars. Keep practicing to earn your invite."
                </p>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={closeUpgradeModal}
                  className="w-full py-4 rounded-2xl bg-primary text-on-primary font-headline text-title-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Understood, Scholar
                </button>
                <div className="flex items-center justify-center gap-2 text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Feature locked by invitation only</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
