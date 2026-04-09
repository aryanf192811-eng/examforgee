import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { useQuizStore } from '../lib/store/quizStore';
import { getSubjects, startQuiz, submitQuiz, saveQuizState } from '../lib/api';
import { cn, formatPercent } from '../lib/utils';
import { VirtualCalculator } from '../components/ui/VirtualCalculator';
import type { SubjectResponse } from '../types';

const modes = [
  { id: 'topic', label: 'Topic Focus', icon: 'subject', desc: 'Deep dive into specific chapters' },
  { id: 'mixed', label: 'Grand Mix', icon: 'shuffle', desc: 'Randomized across all subjects' },
  { id: 'mock', label: 'Full Mock', icon: 'timer', desc: 'Full-length 3-hour GATE simulation' },
  { id: 'PYQ', label: 'Previous Years', icon: 'history', desc: 'Official questions from past exams' }
];

export default function Practice() {
  const { addToast } = useToast();

  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedMode, setSelectedMode] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(15);
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
    if (timeLeft === null && questions.length > 0) {
      setTimeLeft(questions.length * 180); // 3 mins per question
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

  const handleStart = useCallback(async () => {
    if (!selectedSubjectId && selectedMode !== 'mixed') {
      addToast('Please select a subject.', 'warning');
      return;
    }
    const subject = subjects.find(s => s.id === selectedSubjectId);

    setIsStarting(true);
    try {
      const slugs = selectedMode === 'mixed' 
        ? subjects.map(s => s.slug).join(',') 
        : (subject?.slug ?? '');

      const session = await startQuiz(selectedMode, slugs, questionCount);
      setSession(session.session_id);
      setQuestions(session.questions ?? []);
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to start quiz', 'error');
    } finally {
      setIsStarting(false);
    }
  }, [subjects, selectedSubjectId, selectedMode, questionCount, addToast, setSession, setQuestions]);

  const handleSubmit = useCallback(async () => {
    if (!sessionId) return;
    try {
      await saveQuizState(sessionId, answers as Record<string, string>, flags);
      const result = await submitQuiz(sessionId);
      setSubmissionResult(result);
      setSubmitted(true);
      addToast('Simulation submitted successfully!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Submission failed', 'error');
    }
  }, [sessionId, answers, flags, addToast, setSubmitted, setSubmissionResult]);

  const currentQuestion = useMemo(() => questions[currentIndex] ?? null, [questions, currentIndex]);

  if (!sessionId || questions.length === 0) {
    return (
      <AppShell title="Console Prep">
        {isLoadingSubjects ? (
          <div className="max-w-4xl mx-auto grid gap-6">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto space-y-10 py-8"
          >
            <div className="flex flex-col items-center text-center space-y-3">
               <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-display-md text-primary">terminal</span>
               </div>
               <h2 className="text-display-sm font-display font-bold tracking-tight text-on-surface">
                  Engineering Practice Console
               </h2>
               <p className="text-body-lg text-on-surface-variant max-w-lg">
                  Professional GATE-standard examination simulator. Select your domain and proceed to the console.
               </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-8">
                 <section className="space-y-4">
                    <h3 className="text-title-medium font-bold px-1 uppercase tracking-widest text-primary/70">1. Select Mode</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {modes.map((m) => (
                         <button
                           key={m.id}
                           onClick={() => setSelectedMode(m.id)}
                           className={cn(
                             "relative p-6 rounded-3xl border-2 text-left transition-all overflow-hidden group",
                             selectedMode === m.id 
                               ? "bg-primary-container border-primary shadow-xl shadow-primary/10" 
                               : "bg-surface-container border-outline-variant hover:border-primary/50"
                           )}
                         >
                           <h4 className="font-bold text-title-medium mb-1">{m.label}</h4>
                           <p className="text-body-small text-on-surface-variant leading-snug">{m.desc}</p>
                         </button>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <h3 className="text-title-medium font-bold uppercase tracking-widest text-primary/70">2. Session Intensity</h3>
                       <Badge variant="primary" size="lg">{questionCount} Questions</Badge>
                    </div>
                    <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant">
                       <input
                         type="range" min={5} max={65} step={5}
                         value={questionCount}
                         onChange={(e) => setQuestionCount(Number(e.target.value))}
                         className="w-full h-2 bg-outline-variant rounded-full appearance-none cursor-pointer accent-primary"
                       />
                    </div>
                 </section>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-8">
                 <section className="flex-1 space-y-4">
                    <h3 className="text-title-medium font-bold px-1 uppercase tracking-widest text-primary/70">3. Target Domain</h3>
                    <div className="p-4 rounded-3xl bg-surface-container border border-outline-variant max-h-[440px] overflow-y-auto custom-scrollbar">
                       <div className="grid gap-2">
                          <button
                            onClick={() => setSelectedMode('mixed')}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                              selectedMode === 'mixed' ? "bg-secondary-container border-secondary" : "bg-surface border-transparent hover:bg-surface-container-high"
                            )}
                          >
                             <span className="font-bold">Mixed GATE Subjects</span>
                          </button>
                          {subjects.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => { setSelectedSubjectId(s.id); setSelectedMode('topic'); }}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                                selectedSubjectId === s.id && selectedMode !== 'mixed' ? "bg-primary-container border-primary" : "bg-surface border-transparent hover:bg-surface-container-high"
                              )}
                            >
                               <span className="font-bold flex-1 text-left">{s.name}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </section>

                 <Button 
                   size="lg" 
                   fullWidth 
                   onClick={handleStart} 
                   loading={isStarting} 
                   icon="bolt"
                   className="shadow-2xl shadow-primary/20 rounded-3xl py-8"
                 >
                   Launch Console
                 </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AppShell>
    );
  }

  if (isSubmitted && submissionResult) {
    return (
      <AppShell title="Analysis Dashboard">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-12 py-6">
           <div className="relative p-12 rounded-[40px] bg-gradient-to-br from-primary to-primary-container text-white text-center shadow-3xl">
              <h2 className="text-display-xl font-display font-bold">{formatPercent(submissionResult.accuracy_pct)}</h2>
              <p className="text-headline-small opacity-80">Precision Index</p>
           </div>
           <Button size="lg" fullWidth onClick={reset} icon="refresh" className="rounded-3xl py-10">Return to Bridge</Button>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Live Assessment" headerActions={
      <div className="flex items-center gap-6">
         <span className={cn("font-mono text-headline-small font-black", (timeLeft ?? 0) < 180 ? "text-error" : "text-primary")}>
            {formatTime(timeLeft ?? 0)}
         </span>
         <button onClick={() => setIsCalcOpen(true)} className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant">
           <span className="material-symbols-outlined">calculate</span>
         </button>
      </div>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 h-[calc(100vh-140px)]">
         <div className="overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div key={currentQuestion.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                   <div className="flex items-center gap-3">
                      <Badge variant="primary">{currentQuestion.type}</Badge>
                      <Badge variant="secondary">{currentQuestion.marks} Marks</Badge>
                      <div className="flex-1" />
                      <button onClick={() => toggleFlag(currentQuestion.id)} className={cn("px-5 py-2.5 rounded-xl font-black border-2", flags.includes(currentQuestion.id) ? "bg-warning/10 border-warning text-warning" : "bg-surface border-outline-variant text-outline")}>
                        {flags.includes(currentQuestion.id) ? 'FLAGGED' : 'MARK REVIEW'}
                      </button>
                   </div>

                   <div className="p-12 rounded-[48px] bg-surface-container border border-outline-variant">
                      <p className="text-headline-small text-on-surface leading-[1.6]">
                        {currentQuestion.question_text}
                      </p>
                   </div>

                   <div className="space-y-4">
                      {currentQuestion.type === 'MCQ' && (
                          <div className="grid gap-4">
                              {[
                                  { key: 'A', text: currentQuestion.option_a },
                                  { key: 'B', text: currentQuestion.option_b },
                                  { key: 'C', text: currentQuestion.option_c },
                                  { key: 'D', text: currentQuestion.option_d },
                              ].filter(o => o.text).map((opt) => {
                                  const isSelected = answers[currentQuestion.id] === opt.key;
                                  return (
                                      <button key={opt.key} onClick={() => recordAnswer(currentQuestion.id, opt.key)} className={cn("w-full flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all", isSelected ? "bg-primary text-white border-primary" : "bg-surface-container border-transparent hover:bg-primary/5")}>
                                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black", isSelected ? "bg-white text-primary" : "bg-outline-variant/30 text-on-surface-variant")}>
                                              {opt.key}
                                          </div>
                                          <span className="text-title-large flex-1 text-left">{opt.text}</span>
                                      </button>
                                  );
                              })}
                          </div>
                      )}
                      
                      {currentQuestion.type === 'NAT' && (
                          <div className="p-10 rounded-[48px] bg-primary/5 border-2 border-primary/20 flex flex-col items-center">
                             <input
                                 type="number"
                                 value={String(answers[currentQuestion.id] ?? '')}
                                 onChange={(e) => recordAnswer(currentQuestion.id, e.target.value)}
                                 className="bg-transparent text-display-sm font-mono text-center outline-none w-64 border-b-4 border-primary pb-2"
                             />
                          </div>
                      )}
                   </div>

                   <div className="flex items-center justify-between border-t-2 border-outline-variant/50 pt-10">
                      <Button variant="ghost" onClick={prevQuestion} disabled={currentIndex === 0}>Previous</Button>
                      <div className="flex items-center gap-4">
                         <Button variant="secondary" onClick={() => recordAnswer(currentQuestion.id, null)}>Purge</Button>
                         {currentIndex === questions.length - 1 ? (
                           <Button onClick={handleSubmit}>Submit Final</Button>
                         ) : (
                           <Button onClick={nextQuestion}>Save & Next</Button>
                         )}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <div className="hidden lg:flex flex-col bg-surface-container p-8 rounded-[48px] border border-outline-variant overflow-y-auto">
            <h4 className="text-label-lg font-black uppercase tracking-[0.3em] mb-10">Question Palette</h4>
            <div className="grid grid-cols-4 gap-4">
               {questions.map((q, i) => (
                 <button key={q.id} onClick={() => goToQuestion(i)} className={cn("w-full aspect-square rounded-2xl flex items-center justify-center font-black border-2", currentIndex === i ? "border-primary scale-110 shadow-lg" : "border-transparent", flags.includes(q.id) ? "bg-warning text-on-warning" : (answers[q.id] != null && answers[q.id] !== '') ? "bg-primary text-white" : "bg-surface-container-highest")}>
                   {i + 1}
                 </button>
               ))}
            </div>
         </div>
      </div>
      <VirtualCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </AppShell>
  );
}
