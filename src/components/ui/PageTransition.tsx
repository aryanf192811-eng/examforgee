import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition — Shared animation wrapper for all top-level routes.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
}
