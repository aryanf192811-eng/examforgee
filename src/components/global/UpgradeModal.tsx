import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  { icon: 'menu_book', text: 'Unlimited access to all notes & chapters' },
  { icon: 'quiz', text: 'Full mock test suite with detailed analytics' },
  { icon: 'psychology', text: 'AI-powered doubt resolution' },
  { icon: 'auto_awesome', text: 'Priority support & early access features' },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-on-primary text-[28px]">
            workspace_premium
          </span>
        </div>
        <h2 className="font-display text-headline-md text-on-surface mb-2">
          Upgrade to Pro
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Unlock the full ExamForge experience and accelerate your GATE preparation.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">
              {b.icon}
            </span>
            <span className="text-body-md text-on-surface">{b.text}</span>
          </motion.div>
        ))}
      </div>

      <Button variant="primary" fullWidth size="lg" onClick={onClose}>
        Coming Soon
      </Button>
    </Modal>
  );
}
