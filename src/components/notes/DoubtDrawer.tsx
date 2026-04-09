import { useState } from 'react';
import { askDoubt } from '../../lib/api';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DoubtDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  subjectName: string;
  selectedText: string;
}

export function DoubtDrawer({
  isOpen,
  onClose,
  chapterTitle,
  subjectName,
  selectedText,
}: DoubtDrawerProps) {
  const { addToast } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) {
      addToast('Please type your question.', 'warning');
      return;
    }
    setLoading(true);
    setAnswer(null);
    try {
      const res = await askDoubt({
        chapter_title: chapterTitle,
        subject_name: subjectName,
        selected_text: selectedText,
        question: question.trim(),
      });
      setAnswer(res.answer);
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Failed to get answer',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface-container flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-headline text-title-lg text-on-surface">
              Ask a Doubt
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                close
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 custom-scrollbar">
            {/* Selected text context */}
            {selectedText && (
              <div className="rounded-xl bg-surface-container-high p-3">
                <span className="text-label-md text-on-surface-variant block mb-1">
                  Selected text:
                </span>
                <p className="text-body-sm text-on-surface italic line-clamp-3">
                  &ldquo;{selectedText}&rdquo;
                </p>
              </div>
            )}

            {/* Question input */}
            <div>
              <label className="text-label-lg text-on-surface-variant block mb-1.5">
                Your question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to understand better?"
                className="w-full bg-surface-container-high text-on-surface text-body-md rounded-xl p-3 outline-none resize-none h-24 focus:ring-2 focus:ring-primary/30 placeholder:text-outline font-body"
                disabled={loading}
              />
            </div>

            <Button
              fullWidth
              onClick={handleAsk}
              loading={loading}
              icon="auto_awesome"
            >
              Get AI Explanation
            </Button>

            {/* Answer */}
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-primary-container/10 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    auto_awesome
                  </span>
                  <span className="text-label-lg text-primary font-medium">
                    AI Answer
                  </span>
                </div>
                <p className="text-body-md text-on-surface whitespace-pre-wrap">
                  {answer}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
