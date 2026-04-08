import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { useQuizStore } from '../lib/store/quizStore';
import { getSubjects, startQuiz, submitQuiz, saveQuizState } from '../lib/api';
import { cn, safeNum, formatPercent } from '../lib/utils';
import { VirtualCalculator } from '../components/ui/VirtualCalculator';
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
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const {
    sessionId, questions, answers, flags, currentIndex,
    setSession, setQuestions, recordAnswer, toggleFlag,
    nextQuestion, prevQuestion, goToQuestion,
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

  // Timer logic
  useEffect(() => {
    if (!sessionId || isSubmitted || timeLeft === 0) return;
    if (timeLeft === null) {
      setTimeLeft(questions.length * 180); // 3 mins per question avg for GATE
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, isSubmitted, questions.length, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start quiz
  const handleStart = useCallback(async () => {
    if (!selectedSubjectId) {
      addToast('Please select a subject.', 'warning');
      return;
    }
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return;

    setIsStarting(true);
    try {
      const slugs = selectedMode === 'mixed' 
        ? subjects.map(s => s.slug).join(',') 
        : subject.slug;

      const session = await startQuiz(selectedMode, slugs, questionCount);
      setSession(session.session_id);
      setQuestions(session.questions ?? []);
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to start quiz', 'error');
    } finally {
      setIsStarting(false);
    }
  }, [subjects, selectedSubjectId, selectedMode, questionCount, addToast, setSession, setQuestions]);

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (!sessionId) return;
    try {
      await saveQuizState(sessionId, answers as Record<string, string>, flags);
      const result = await submitQuiz(sessionId);
      setSubmissionResult(result);
      setSubmitted(true);
      addToast('Quiz submitted!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to submit', 'error');
    }
  }, [sessionId, answers, flags, addToast, setSubmitted, setSubmissionResult]);

  const currentQuestion = questions[currentIndex] ?? null;

  // ── Setup View ──
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
            className="max-w-xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h2 className="font-display text-headline-lg text-on-surface mb-2">Practice Console</h2>
              <p className="text-body-md text-on-surface-variant">Configure your GATE-style examination environment</p>
            </div>

            <div className="grid gap-6">
              <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant space-y-6">
                 {/* Subject */}
                 <div>
                    <label className="text-label-lg text-on-surface-variant block mb-3">Target Subject</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedMode('mixed')}
                        className={cn(
                          'px-4 py-2 rounded-xl text-label-lg transition-all border-2',
                          selectedMode === 'mixed' ? 'bg-primary-container border-primary text-on-primary-container font-bold' : 'bg-surface border-transparent text-on-surface-variant hover:bg-surface-container-high'
                        )}
                      >
                        Mixed Subjects
                      </button>
                      {subjects.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedSubjectId(s.id); setSelectedMode('topic'); }}
                          className={cn(
                            'px-4 py-2 rounded-xl text-label-lg transition-all border-2',
                            selectedSubjectId === s.id && selectedMode !== 'mixed'
                              ? 'bg-secondary-container border-secondary text-on-secondary-container font-bold'
                              : 'bg-surface border-transparent text-on-surface-variant hover:bg-surface-container-high'
                          )}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Mode */}
                 <div>
                    <label className="text-label-lg text-on-surface-variant block mb-3">Simulation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                       {modes.map(m => (
                         <button
                           key={m}
                           onClick={() => setSelectedMode(m)}
                           className={cn(
                             'p-3 rounded-xl text-label-md border-2 transition-all capitalize',
                             selectedMode === m ? 'bg-tertiary-container border-tertiary text-on-tertiary-container font-bold' : 'bg-surface border-transparent text-on-surface-variant'
                           )}
                         >
                           {m} Mode
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Count */}
                 <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-label-lg text-on-surface-variant">Question Count</label>
                      <span className="text-label-lg font-bold text-primary">{questionCount}</span>
                    </div>
                    <input
                      type="range" min={5} max={50} step={5}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                 </div>
              </div>

              <Button size="lg" onClick={handleStart} loading={isStarting} icon="play_arrow">
                Start Simulation
              </Button>
            </div>
          </motion.div>
        )}
      </AppShell>
    );
  }

  // ── Results View ──
  if (isSubmitted && submissionResult) {
    return (
      <AppShell title="Results Overview">
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-8 rounded-3xl bg-surface-container flex flex-col items-center justify-center text-center">
                 <Badge variant="success" size="lg" className="mb-4">Simulation Complete</Badge>
                 <div className="text-display-lg font-display text-primary leading-none mb-2">
                   {formatPercent(submissionResult.accuracy_pct)}
                 </div>
                 <p className="text-body-lg text-on-surface-variant">Overall Accuracy</p>
              </div>
              <div className="grid gap-4">
                 {[
                   { label: 'Marks', val: `${submissionResult.marks_obtained}/${submissionResult.total_marks}`, color: 'text-primary' },
                   { label: 'Correct', val: submissionResult.correct, color: 'text-success' },
                   { label: 'Incorrect', val: submissionResult.incorrect, color: 'text-error' },
                   { label: 'Unanswered', val: submissionResult.unanswered, color: 'text-outline' },
                 ].map(stat => (
                   <div key={stat.label} className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
                      <p className="text-label-sm text-on-surface-variant mb-1">{stat.label}</p>
                      <p className={cn("text-title-lg font-bold", stat.color)}>{stat.val}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="font-display text-headline-sm px-2">Detailed Analysis</h3>
              <div className="grid gap-4">
                {submissionResult.question_results.map((res, i) => {
                  const q = questions.find(question => question.id === res.question_id);
                  if (!q) return null;
                  return (
                    <div key={q.id} className="p-6 rounded-2xl bg-surface-container border border-outline-variant hover:border-outline transition-colors">
                       <div className="flex items-center gap-3 mb-4">
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-label-md",
                            res.is_correct ? "bg-success/10 text-success" : "bg-error/10 text-error"
                          )}>
                            Q{i + 1}
                          </span>
                          <span className="text-body-sm text-on-surface-variant font-mono uppercase tracking-widest">{q.subject_slug}</span>
                          <div className="flex-1" />
                          <Badge variant={res.is_correct ? "success" : "error"}>
                            {res.is_correct ? `+${res.marks_awarded}` : `-${res.marks_awarded || '0.33'}`}
                          </Badge>
                       </div>
                       <p className="text-body-md text-on-surface mb-6">{q.question_text}</p>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                             <p className="text-[10px] text-outline-variant font-bold uppercase mb-1">Your Choice</p>
                             <p className="font-bold text-on-surface">{res.user_answer || 'NONE'}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                             <p className="text-[10px] text-primary/50 font-bold uppercase mb-1">Correct Identity</p>
                             <p className="font-bold text-primary">{res.correct_answer}</p>
                          </div>
                       </div>
                       {res.explanation && (
                         <div className="p-4 rounded-xl bg-surface-container-highest/50 text-body-sm text-on-surface-variant" dangerouslySetInnerHTML={{ __html: res.explanation }} />
                       )}
                    </div>
                  );
                })}
              </div>
           </div>

           <Button size="lg" fullWidth onClick={reset} icon="replay">Return to Prep</Button>
        </div>
      </AppShell>
    );
  }

  // ── Console Simulation View ──
  return (
    <AppShell title="GATE Engineering Console" headerActions={
      <div className="flex items-center gap-4">
         <div className="hidden md:flex flex-col items-end">
            <span className="text-label-sm text-outline font-bold uppercase tracking-wider">Time Remaining</span>
            <span className={cn("font-mono text-title-lg font-bold", (timeLeft ?? 0) < 300 ? "text-error" : "text-primary")}>
               {formatTime(timeLeft ?? 0)}
            </span>
         </div>
         <button 
           onClick={() => setIsCalcOpen(true)}
           className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer border border-outline-variant"
         >
           <span className="material-symbols-outlined">calculate</span>
         </button>
      </div>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 h-[calc(100vh-140px)]">
         {/* Main Question Area */}
         <div className="overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                 {/* Metadata */}
                 <div className="flex items-center flex-wrap gap-2">
                    <Badge variant="primary">{currentQuestion.type}</Badge>
                    <Badge variant="secondary">{currentQuestion.marks} Marks</Badge>
                    {currentQuestion.gate_year && <Badge variant="tertiary">GATE {currentQuestion.gate_year}</Badge>}
                    <div className="flex-1" />
                    <button 
                      onClick={() => toggleFlag(currentQuestion.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-label-md font-bold transition-all border",
                        flags.includes(currentQuestion.id) 
                          ? "bg-warning/10 border-warning text-warning" 
                          : "bg-surface border-outline-variant text-on-surface-variant hover:border-outline"
                      )}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {flags.includes(currentQuestion.id) ? 'bookmark_added' : 'bookmark'}
                      </span>
                      {flags.includes(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                    </button>
                 </div>

                 {/* Question Content */}
                 <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant">
                    <p className="text-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                      {currentQuestion.question_text}
                    </p>
                 </div>

                 {/* Inputs */}
                 <div className="space-y-4">
                    {currentQuestion.type === 'MCQ' && (
                        <div className="grid gap-3">
                            {[
                                { key: 'A', text: currentQuestion.option_a },
                                { key: 'B', text: currentQuestion.option_b },
                                { key: 'C', text: currentQuestion.option_c },
                                { key: 'D', text: currentQuestion.option_d },
                            ].filter(o => o.text).map((opt) => {
                                const isSelected = answers[currentQuestion.id] === opt.key;
                                return (
                                    <button
                                        key={opt.key}
                                        onClick={() => recordAnswer(currentQuestion.id, opt.key)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group cursor-pointer",
                                            isSelected 
                                              ? "bg-primary-container border-primary text-on-primary-container shadow-sm" 
                                              : "bg-surface-container border-transparent hover:bg-surface-container-high"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-label-lg transition-all",
                                            isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant group-hover:bg-outline-variant"
                                        )}>
                                            {opt.key}
                                        </span>
                                        <span className="text-title-small flex-1 text-left">{opt.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {currentQuestion.type === 'NAT' && (
                        <div className="p-6 rounded-3xl bg-surface-container border-2 border-primary/20">
                            <label className="text-label-md text-primary font-bold uppercase mb-2 block">Numerical Response</label>
                            <input
                                type="number"
                                step="any"
                                value={String(answers[currentQuestion.id] ?? '')}
                                placeholder="Enter calculated value..."
                                onChange={(e) => recordAnswer(currentQuestion.id, e.target.value)}
                                className="w-full bg-transparent text-headline-sm font-mono text-on-surface outline-none"
                                autoFocus
                            />
                        </div>
                    )}
                 </div>

                 {/* Interaction Bar */}
                 <div className="flex items-center justify-between border-t border-outline-variant pt-6">
                    <Button variant="ghost" onClick={prevQuestion} disabled={currentIndex === 0} icon="chevron_left">Previous</Button>
                    <div className="flex items-center gap-2">
                       <Button variant="secondary" onClick={() => recordAnswer(currentQuestion.id, null)} icon="backspace">Clear Answer</Button>
                       {currentIndex === questions.length - 1 ? (
                         <Button onClick={handleSubmit} icon="done_all" variant="primary">Submit Console</Button>
                       ) : (
                         <Button onClick={nextQuestion} iconRight="chevron_right">Save & Next</Button>
                       )}
                    </div>
                 </div>
              </motion.div>
            ) : (
              <Skeleton variant="card" />
            )}
         </div>

         {/* Palette Palette */}
         <div className="hidden lg:flex flex-col h-full bg-surface-container p-6 rounded-3xl border border-outline-variant overflow-hidden">
            <h4 className="text-label-lg font-bold text-on-surface mb-6 uppercase tracking-widest flex items-center gap-2">
               <span className="material-symbols-outlined text-[20px]">apps</span>
               Question Palette
            </h4>
            
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-3 h-0 content-start">
               {questions.map((q, i) => {
                  const isCurrent = currentIndex === i;
                  const isAnswered = answers[q.id] != null && answers[q.id] !== '';
                  const isFlagged = flags.includes(q.id);
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(i)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-label-md transition-all border-2",
                        isCurrent ? "border-primary scale-110 shadow-lg" : "border-transparent",
                        isFlagged ? "bg-warning text-on-warning" : 
                        isAnswered ? "bg-success text-on-success" : 
                        "bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant"
                      )}
                    >
                      {i + 1}
                    </button>
                  );
               })}
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant space-y-3">
               <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                  <span className="w-3 h-3 rounded-full bg-success" /> Answered
               </div>
               <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                  <span className="w-3 h-3 rounded-full bg-warning" /> Marked for Review
               </div>
               <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                  <span className="w-3 h-3 rounded-full bg-surface-container-highest" /> Not Visited
               </div>
            </div>
         </div>
      </div>

      <VirtualCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </AppShell>
  );
}
