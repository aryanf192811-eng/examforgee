import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { useQuizStore } from '../lib/store/quizStore';
import { getSubjects, startQuiz, submitQuiz, saveQuizState } from '../lib/api';
import { cn, safeNum, formatPercent } from '../lib/utils';
import type { SubjectResponse, QuizQuestion } from '../types';

const modes = ['topic', 'mixed', 'mock', 'PYQ'];

export default function Practice() {
  const { addToast } = useToast();

  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedMode, setSelectedMode] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarting, setIsStarting] = useState(false);

  const {
    sessionId, questions, answers, currentIndex,
    setSession, setQuestions, recordAnswer, nextQuestion, prevQuestion,
    setSubmitted, setSubmissionResult, isSubmitted, submissionResult, reset,
  } = useQuizStore();

  // Load subjects
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoadingSubjects(true);
      try {
        const data = await getSubjects();
        if (!cancelled) {
          setSubjects(data ?? []);
          if (data?.length > 0) setSelectedSubjectId(data[0].id);
        }
      } catch { /* handled */ }
      finally { if (!cancelled) setIsLoadingSubjects(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Start quiz
  const handleStart = useCallback(async () => {
    if (!selectedSubjectId) {
      addToast('Please select a subject.', 'warning');
      return;
    }
    setIsStarting(true);
    try {
      // API Signature: startQuiz(mode, subjectIds, count)
      const session = await startQuiz(selectedMode, selectedSubjectId, questionCount);
      setSession(session.session_id);
      if (session.questions) {
        setQuestions(session.questions);
      } else {
        setQuestions([]);
      }
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to start quiz', 'error');
    } finally {
      setIsStarting(false);
    }
  }, [selectedSubjectId, selectedMode, questionCount, addToast, setSession, setQuestions]);

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (!sessionId) return;
    try {
      // First save the current answers to the backend (Redis-backed hot state)
      await saveQuizState(sessionId, answers as Record<string, string>, []);
      // Then submit for final grading
      const result = await submitQuiz(sessionId);
      setSubmissionResult(result);
      setSubmitted(true);
      addToast('Quiz submitted!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to submit', 'error');
    }
  }, [sessionId, answers, addToast, setSubmitted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!questions.length || isSubmitted) return;
    const handler = (e: KeyboardEvent) => {
      const q = questions[currentIndex];
      if (!q || q.type !== 'MCQ') return;
      const keys = ['a', 'b', 'c', 'd'];
      const keyIdx = keys.indexOf(e.key.toLowerCase());
      if (keyIdx >= 0 && q.options) {
        const opt = q.options[keyIdx];
        if (opt) {
          recordAnswer(q.id, opt.key);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [questions, currentIndex, isSubmitted, recordAnswer]);

  const currentQuestion = questions[currentIndex] ?? null;

  // ── No active session: show filter bar ──
  if (!sessionId || questions.length === 0) {
    return (
      <AppShell title="Practice">
        {isLoadingSubjects ? (
          <div className="space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="max-w-lg mx-auto space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-headline-lg text-on-surface mb-2">
                Start a Practice Session
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Choose your subject, mode, and number of questions
              </p>
            </div>

            {/* Subject select */}
            <div>
              <label className="text-label-lg text-on-surface-variant block mb-2">Subject</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-label-lg transition-colors spring-transition cursor-pointer',
                      selectedSubjectId === s.id
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode select */}
            <div>
              <label className="text-label-lg text-on-surface-variant block mb-2">Mode</label>
              <div className="flex flex-wrap gap-2">
                {modes.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-label-lg transition-colors spring-transition capitalize cursor-pointer',
                      selectedMode === m
                        ? 'bg-secondary-container text-on-secondary-container font-semibold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="text-label-lg text-on-surface-variant block mb-2">
                Questions: {questionCount}
              </label>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleStart}
              loading={isStarting}
              icon="play_arrow"
            >
              Start Quiz
            </Button>
          </motion.div>
        )}
      </AppShell>
    );
  }

  // ── Active session: show quiz ──
  if (isSubmitted && submissionResult) {
    const total = submissionResult.total_questions;
    const correct = submissionResult.correct;
    const accuracy = submissionResult.accuracy_pct;

    return (
      <AppShell title="Results">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Score card */}
          <div className="rounded-2xl bg-surface-container p-8 text-center">
            <h2 className="font-display text-headline-lg text-on-surface mb-2">
              Quiz Complete
            </h2>
            <div className="font-display text-display-md text-primary mb-2">
              {formatPercent(accuracy, 0)}
            </div>
            <p className="text-body-md text-on-surface-variant">
              {correct} of {total} correct
            </p>
          </div>

          {/* Question review */}
          <div className="space-y-4">
            {submissionResult.question_results.map((res, i) => {
              const q = questions.find(question => question.id === res.question_id);
              if (!q) return null;
              const isCorrect = res.is_correct;
              return (
                <div key={q.id} className="rounded-2xl bg-surface-container p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge variant={isCorrect ? 'success' : 'error'} size="sm">
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                    <span className="text-label-md text-on-surface-variant">Q{i + 1}</span>
                  </div>
                  <p className="text-body-md text-on-surface mb-3">{q.stem}</p>
                  {res.explanation && (
                    <p className="text-body-sm text-on-surface-variant italic">
                      {res.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Button fullWidth size="lg" onClick={reset} icon="replay">
            Practice Again
          </Button>
        </motion.div>
      </AppShell>
    );
  }

  // ── Active question ──
  return (
    <AppShell title={`Practice — Q${currentIndex + 1}/${questions.length}`}>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full progress-quill rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-label-md text-on-surface-variant shrink-0">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {/* Question meta */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">{currentQuestion.type}</Badge>
              {currentQuestion.marks != null && (
                <Badge variant="secondary">{safeNum(currentQuestion.marks)} marks</Badge>
              )}
              {currentQuestion.difficulty && (
                <Badge variant="tertiary">{currentQuestion.difficulty}</Badge>
              )}
              {currentQuestion.gate_year != null && (
                <Badge variant="primary">GATE {currentQuestion.gate_year}</Badge>
              )}
            </div>

            {/* Stem */}
            <div className="rounded-2xl bg-surface-container p-6 mb-6">
              <p className="font-headline text-body-lg text-on-surface">
                {currentQuestion.stem}
              </p>
            </div>

            {/* Options (MCQ) */}
            {currentQuestion.type === 'MCQ' && currentQuestion.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === opt.key;
                  const labels = ['A', 'B', 'C', 'D'];
                  return (
                    <motion.button
                      key={opt.key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => recordAnswer(currentQuestion.id, opt.key)}
                      className={cn(
                        'w-full text-left flex items-center gap-4 p-4 rounded-xl transition-colors spring-transition cursor-pointer',
                        isSelected
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-label-lg font-bold shrink-0',
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                      )}>
                        {labels[i] || opt.key}
                      </span>
                      <span className="text-body-md">{opt.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* NAT input */}
            {currentQuestion.type === 'NAT' && (
              <div className="mb-6">
                <input
                  type="number"
                  placeholder="Enter numerical answer"
                  value={(answers[currentQuestion.id] as string) ?? ''}
                  onChange={(e) => recordAnswer(currentQuestion.id, e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-body-lg rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                icon="arrow_back"
              >
                Previous
              </Button>

              {currentIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  icon="check"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  iconRight="arrow_forward"
                >
                  Next
                </Button>
              )}
            </div>

            {/* Keyboard hint */}
            {currentQuestion.type === 'MCQ' && (
              <p className="text-center text-label-sm text-outline mt-4">
                Press A, B, C, or D to select an answer
              </p>
            )}
          </motion.div>
        ) : (
          <EmptyState
            icon="quiz"
            title="No questions available"
            description="Try a different filter combination"
            action={{ label: 'Reset', onClick: reset, icon: 'refresh' }}
          />
        )}
      </div>
    </AppShell>
  );
}
