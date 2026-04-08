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
    if (timeLeft === null) {
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

  // ── Setup View ──
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
               <h2 className="text-display-sm font-display font-bold tracking-tight bg-gradient-to-br from-on-surface to-on-surface-variant bg-clip-text text-transparent">
                  Engineering Practice Console
               </h2>
               <p className="text-body-lg text-on-surface-variant max-w-lg">
                  Professional GATE-standard examination simulator. Select your domain and proceed to the console.
               </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Side: Modes */}
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
                           <span className={cn(
                             "material-symbols-outlined mb-3 transition-colors",
                             selectedMode === m.id ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                           )}>
                             {m.icon}
                           </span>
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
                       <div className="flex justify-between mt-4 text-label-medium text-outline">
                          <span>Sprint</span>
                          <span>Marathon</span>
                       </div>
                    </div>
                 </section>
              </div>

              {/* Right Side: Subjects */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                 <section className="flex-1 space-y-4">
                    <h3 className="text-title-medium font-bold px-1 uppercase tracking-widest text-primary/70">3. Target Domain</h3>
                    <div className="p-4 rounded-3xl bg-surface-container border border-outline-variant max-h-[440px] overflow-y-auto custom-scrollbar">
                       <div className="grid gap-2">
                          <button
                            onClick={() => setSelectedMode('mixed')}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                              selectedMode === 'mixed' ? "bg-secondary-container border-secondary shadow-lg shadow-secondary/5" : "bg-surface border-transparent hover:bg-surface-container-high"
                            )}
                          >
                             <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined">auto_awesome</span>
                             </div>
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
                               <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10">
                                  <span className="material-symbols-outlined">{s.icon || 'menu_book'}</span>
                               </div>
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
                   className="shadow-2xl shadow-primary/20 rounded-3xl py-8 text-headline-small"
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

  // ── Results View ──
  if (isSubmitted && submissionResult) {
    return (
      <AppShell title="Analysis Dashboard">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-12 py-6"
        >
           {/* Top Scorecard */}
           <div className="relative p-12 rounded-[40px] bg-gradient-to-br from-primary to-primary-container overflow-hidden text-center text-white shadow-3xl shadow-primary/30">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                 <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-6 py-2 uppercase tracking-[0.2em] font-bold">Performance Summary</Badge>
                 <h2 className="text-display-xl font-display font-bold leading-none tracking-tighter">
                    {formatPercent(submissionResult.accuracy_pct)}
                 </h2>
                 <p className="text-headline-small opacity-80 font-light">Precision Index</p>
                 <div className="flex gap-12 mt-8">
                    <div>
                       <p className="text-headline-small font-bold">{submissionResult.marks_obtained}</p>
                       <p className="text-label-lg opacity-60">Score Acquired</p>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div>
                       <p className="text-headline-small font-bold">{submissionResult.correct}/{submissionResult.total_questions}</p>
                       <p className="text-label-lg opacity-60">Success Rate</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Stats Grid */}
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Marks Obtained', val: submissionResult.marks_obtained, suffix: ` / ${submissionResult.total_marks}`, icon: 'military_tech', color: 'text-primary' },
                { label: 'Correct Hits', val: submissionResult.correct, suffix: ' Questions', icon: 'check_circle', color: 'text-success' },
                { label: 'Incorrect Hits', val: submissionResult.incorrect, suffix: ' Questions', icon: 'cancel', color: 'text-error' },
                { label: 'Time Consumed', val: '24m 12s', suffix: '', icon: 'schedule', color: 'text-secondary' },
              ].map(stat => (
                <div key={stat.label} className="p-6 rounded-3xl bg-surface-container border border-outline-variant hover:border-primary/30 transition-all group">
                   <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", stat.color, "bg-current/10")}>
                      <span className="material-symbols-outlined">{stat.icon}</span>
                   </div>
                   <p className="text-label-lg text-on-surface-variant font-medium mb-1">{stat.label}</p>
                   <p className="text-headline-small font-bold text-on-surface">
                      {stat.val}<span className="text-body-medium text-outline font-normal">{stat.suffix}</span>
                   </p>
                </div>
              ))}
           </div>

           {/* Breakdown */}
           <div className="space-y-8">
              <div className="flex items-center gap-4 px-2">
                 <h3 className="text-headline-small font-display font-bold">Deep Logic Analysis</h3>
                 <div className="h-px flex-1 bg-outline-variant/50" />
              </div>
              <div className="grid gap-6">
                {submissionResult.question_results.map((res, i) => {
                  const q = questions.find(question => question.id === res.question_id);
                  if (!q) return null;
                  return (
                    <motion.div 
                      key={q.id} 
                      whileHover={{ scale: 1.01 }}
                      className="p-8 rounded-[32px] bg-surface-container border border-outline-variant relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
                    >
                       <div className={cn(
                         "absolute left-0 top-0 w-2 h-full transition-colors",
                         res.is_correct ? "bg-success" : "bg-error"
                       )} />
                       
                       <div className="flex items-flex flex-wrap gap-4 mb-8">
                          <span className={cn(
                            "px-4 py-2 rounded-xl flex items-center justify-center font-bold text-label-lg shadow-sm border",
                            res.is_correct ? "bg-success/10 border-success/20 text-success" : "bg-error/10 border-error/20 text-error"
                          )}>
                            ITEM #{i + 1}
                          </span>
                          <Badge variant="primary" className="font-mono text-[10px] uppercase tracking-widest">{q.subject_slug}</Badge>
                          <div className="flex-1" />
                          <div className={cn(
                             "text-title-medium font-bold px-4 py-2 rounded-xl border border-outline-variant",
                             res.is_correct ? "text-success" : "text-error"
                          )}>
                             {res.is_correct ? `+ ${res.marks_awarded}` : `- ${res.marks_awarded || '0.33'}`} MARK
                          </div>
                       </div>

                       <p className="text-headline-small text-on-surface leading-snug mb-8 font-light italic">
                          "{q.question_text}"
                       </p>

                       <div className="grid md:grid-cols-2 gap-6 p-1 rounded-3xl bg-surface-container-low border border-outline-variant/30">
                          <div className="p-6 rounded-2xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20 shadow-inner">
                             <p className="text-[10px] text-outline font-black uppercase tracking-widest">Your Candidate</p>
                             <p className={cn("text-title-large font-bold", res.is_correct ? "text-success" : "text-error")}>
                                {res.user_answer || 'VACANT'}
                             </p>
                          </div>
                          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-1 shadow-inner">
                             <p className="text-[10px] text-primary/50 font-black uppercase tracking-widest">Ground Truth</p>
                             <p className="text-title-large font-bold text-primary">{res.correct_answer}</p>
                          </div>
                       </div>
                    </motion.div>
                  );
                })}
              </div>
           </div>

           <Button size="lg" fullWidth onClick={reset} icon="refresh" className="rounded-3xl py-10 text-headline-small shadow-xl shadow-primary/10">Return to Bridge</Button>
        </motion.div>
      </AppShell>
    );
  }

  // ── Console View ──
  return (
    <AppShell title="Live Assessment" headerActions={
      <div className="flex items-center gap-6">
         <div className="hidden md:flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-outline font-black uppercase tracking-[0.2em]">Session Timer</span>
            <span className={cn(
              "font-mono text-headline-small font-black tracking-tighter transition-colors tabular-nums", 
              (timeLeft ?? 0) < 180 ? "text-error animate-pulse" : "text-primary"
            )}>
               {formatTime(timeLeft ?? 0)}
            </span>
         </div>
         <div className="h-10 w-px bg-outline-variant/50 hidden md:block" />
         <button 
           onClick={() => setIsCalcOpen(true)}
           className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer border border-outline-variant shadow-sm active:scale-95"
         >
           <span className="material-symbols-outlined text-display-xs">calculate</span>
         </button>
      </div>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 h-[calc(100vh-140px)]">
         {/* Main Question Area */}
         <div className="overflow-y-auto space-y-8 pr-4 custom-scrollbar-premium">
            <AnimatePresence mode="wait">
              {currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, scale: 0.98, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: 10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-10"
                >
                   {/* Context Bar */}
                   <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-label-lg font-black uppercase tracking-widest">{currentQuestion.type}</span>
                      </div>
                      <Badge variant="primary" className="px-4 py-2 text-label-lg whitespace-nowrap">{currentQuestion.marks} Marks</Badge>
                      {currentQuestion.gate_year && (
                        <Badge variant="tertiary" className="px-4 py-2 text-label-lg">Official GATE {currentQuestion.gate_year}</Badge>
                      )}
                      
                      <div className="flex-1" />
                      
                      <button 
                        onClick={() => toggleFlag(currentQuestion.id)}
                        className={cn(
                          "flex items-center gap-3 px-5 py-2.5 rounded-xl text-label-lg font-black transition-all border-2",
                          flags.includes(currentQuestion.id) 
                            ? "bg-warning/10 border-warning text-warning shadow-lg shadow-warning/5" 
                            : "bg-surface border-outline-variant text-outline hover:border-primary/50"
                        )}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {flags.includes(currentQuestion.id) ? 'bookmark_added' : 'bookmark'}
                        </span>
                        {flags.includes(currentQuestion.id) ? 'FLAGGED' : 'MARK REVIEW'}
                      </button>
                   </div>

                   {/* Statement */}
                   <div className="p-12 rounded-[48px] bg-surface-container border border-outline-variant relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <span className="material-symbols-outlined text-[120px]">help</span>
                      </div>
                      <div className="relative z-10">
                         <h3 className="text-label-sm text-outline font-black uppercase tracking-[0.3em] mb-6">Inquiry Statement</h3>
                         <p className="text-headline-small text-on-surface leading-[1.6] font-display">
                           {currentQuestion.question_text}
                         </p>
                      </div>
                   </div>

                   {/* Options Area */}
                   <div className="space-y-10 pb-12">
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
                                      <button
                                          key={opt.key}
                                          onClick={() => recordAnswer(currentQuestion.id, opt.key)}
                                          className={cn(
                                              "w-full flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all group overflow-hidden relative shadow-sm",
                                              isSelected 
                                                ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20" 
                                                : "bg-surface-container border-transparent hover:bg-primary/5 hover:border-primary/30"
                                          )}
                                      >
                                          <div className={cn(
                                              "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-headline-small transition-all",
                                              isSelected ? "bg-white text-primary" : "bg-outline-variant/30 text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary"
                                          )}>
                                              {opt.key}
                                          </div>
                                          <span className="text-title-large flex-1 text-left font-medium">{opt.text}</span>
                                          {isSelected && (
                                            <motion.span 
                                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                                              className="material-symbols-outlined text-white"
                                            >
                                              check_circle
                                            </motion.span>
                                          )}
                                      </button>
                                  );
                              })}
                          </div>
                      )}

                      {currentQuestion.type === 'NAT' && (
                          <div className="p-10 rounded-[48px] bg-primary/5 border-2 border-primary/20 flex flex-col items-center">
                             <span className="text-label-lg text-primary font-black uppercase tracking-[0.2em] mb-6">Decimal Value Result</span>
                             <div className="relative group">
                                <input
                                    type="number"
                                    step="any"
                                    value={String(answers[currentQuestion.id] ?? '')}
                                    placeholder="0.00"
                                    onChange={(e) => recordAnswer(currentQuestion.id, e.target.value)}
                                    className="bg-transparent text-display-sm font-mono text-on-surface text-center outline-none w-64 border-b-4 border-primary/50 focus:border-primary transition-all pb-2"
                                    autoFocus
                                />
                             </div>
                             <p className="mt-6 text-body-medium text-outline">Precise calculation required for full attribution.</p>
                          </div>
                      )}
                   </div>

                   {/* Navigation Footer */}
                   <div className="flex items-center justify-between border-t-2 border-outline-variant/50 pt-10 px-4 mt-8">
                      <Button variant="ghost" size="lg" onClick={prevQuestion} disabled={currentIndex === 0} icon="arrow_back">Previous</Button>
                      <div className="flex items-center gap-4">
                         <Button variant="secondary" size="lg" onClick={() => recordAnswer(currentQuestion.id, null)} icon="delete_sweep">Purge</Button>
                         {currentIndex === questions.length - 1 ? (
                           <Button onClick={handleSubmit} size="lg" icon="verified" className="px-12 rounded-2xl shadow-2xl shadow-primary/30">Submit Final</Button>
                         ) : (
                           <Button onClick={nextQuestion} size="lg" iconRight="arrow_forward" className="px-10 rounded-2xl shadow-xl shadow-primary/10">Save & Next</Button>
                         )}
                      </div>
                   </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <Skeleton className="w-full h-96 rounded-[48px]" />
                </div>
              )}
            </AnimatePresence>
         </div>

         {/* Question Palette (Premium Right Sidebar) */}
         <div className="hidden lg:flex flex-col bg-surface-container p-8 rounded-[48px] border border-outline-variant overflow-hidden shadow-2xl shadow-on-surface/5">
            <header className="mb-10 flex flex-col gap-2">
               <h4 className="text-label-lg font-black text-on-surface-variant uppercase tracking-[0.3em]">Map Strategy</h4>
               <p className="text-body-small text-outline leading-tight">Fast navigation through your examination session.</p>
            </header>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar-premium grid grid-cols-4 gap-4 h-0 content-start py-2">
               {questions.map((q, i) => {
                  const isCurrent = currentIndex === i;
                  const isAnswered = answers[q.id] != null && answers[q.id] !== '';
                  const isFlagged = flags.includes(q.id);
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(i)}
                      className={cn(
                        "w-full aspect-square rounded-2xl flex items-center justify-center font-black text-title-medium transition-all relative border-2",
                        isCurrent ? "border-primary scale-110 shadow-xl shadow-primary/20 z-10" : "border-transparent",
                        isFlagged ? "bg-warning text-on-warning" : 
                        isAnswered ? "bg-primary text-white" : 
                        "bg-surface-container-highest text-outline hover:text-primary hover:bg-primary/10"
                      )}
                    >
                      {i + 1}
                      {isFlagged && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-warning" />}
                    </button>
                  );
               })}
            </div>

            <footer className="mt-10 pt-8 border-t border-outline-variant/50 space-y-4">
               <div className="flex items-center gap-4 text-label-medium font-bold text-on-surface-variant">
                  <span className="w-4 h-4 rounded-md bg-primary" /> Verified Answer
               </div>
               <div className="flex items-center gap-4 text-label-medium font-bold text-on-surface-variant">
                  <span className="w-4 h-4 rounded-md bg-warning" /> Flagged Review
               </div>
               <div className="flex items-center gap-4 text-label-medium font-bold text-on-surface-variant">
                  <span className="w-4 h-4 rounded-md bg-surface-container-highest" /> Not Visited
               </div>
            </footer>
         </div>
      </div>

      <VirtualCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </AppShell>
  );
}
