import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { fetchSubjects, fetchQuestions, startQuizSession, submitQuizSession } from "../lib/api";
import type {
  Subject,
  Question,
  QuizSession,
} from "../types";

export function Practice() {
  const [activeTab, setActiveTab] = useState<"daily" | "subjects" | "mocks">("daily");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(0);

  useEffect(() => {
    if (activeTab === "subjects") {
      async function load() {
        try {
          setSubjectsLoading(true);
          const data = await fetchSubjects();
          setSubjects(data);
        } catch (err) {
          console.error("Failed to load subjects:", err);
        } finally {
          setSubjectsLoading(false);
        }
      }
      load();
    }
  }, [activeTab]);

  const startQuiz = async (subjectId: string, mode = "practice", count = 10) => {
    try {
      setQuizLoading(true);
      setResults(null);
      
      // 1. Fetch questions from SQLite
      const qData = await fetchQuestions(subjectId, undefined, mode, count);
      setQuestions(qData);
      
      // 2. Create session in Supabase
      const session = await startQuizSession({
        subject_id: subjectId,
        mode: mode,
        total_questions: qData.length
      });
      
      setCurrentSession(session);
      setAnswers({});
      setCurrentIndex(0);
      setTimeStarted(Date.now());
    } catch (err) {
      console.error("Failed to start quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const submitCurrentQuiz = async () => {
    if (!currentSession || !questions.length) return;
    try {
      setQuizLoading(true);
      const timeTaken = Math.floor((Date.now() - timeStarted) / 1000);
      
      // Calculate score (Client side for instant feedback)
      let correct = 0;
      const submissionAnswers = questions.map(q => {
        const isCorrect = answers[q.id] === q.correct_option;
        if (isCorrect) correct++;
        return {
          question_id: q.id,
          selected_option: answers[q.id] || null,
          is_correct: isCorrect,
          time_taken_s: 0 // Simplification
        };
      });

      const score = correct * 1; // Basic 1 mark per question

      await submitQuizSession(currentSession.id, {
        score,
        correct_count: correct,
        time_taken_s: timeTaken,
        answers: submissionAnswers
      });

      setResults({
        score,
        correct,
        total: questions.length,
        time_taken_s: timeTaken
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const currentQuestion = questions[currentIndex];

  if (results) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in space-y-10">
        <header className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-on-surface text-transparent bg-clip-text academic-gradient">Synthesis Complete</h1>
          <p className="text-on-surface-variant font-notes italic">Performance analysis successful.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-4xl font-display font-bold text-primary">{results.score}</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-2">Points Earned</div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-4xl font-display font-bold text-on-surface">{results.correct} / {results.total}</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-2">Accuracy</div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-4xl font-display font-bold text-on-surface">{Math.floor(results.time_taken_s / 60)}m {results.time_taken_s % 60}s</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-2">Time Invested</div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="primary" onClick={() => { setCurrentSession(null); setResults(null); }} className="rounded-full px-12 py-6 text-lg academic-gradient">
            Return to Arena
          </Button>
        </div>
      </div>
    );
  }

  if (currentSession && currentQuestion) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
          <button onClick={() => setCurrentSession(null)} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span> Exit Quiz
          </button>
          <Button variant="primary" onClick={submitCurrentQuiz} disabled={quizLoading} className="rounded-full px-8 academic-gradient">
            {quizLoading ? "Submitting..." : "Submit Synthesis"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <div className="space-y-6">
              <div className="flex gap-3">
                <span className="text-xs font-label bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full uppercase tracking-wider">{currentQuestion.type}</span>
                <span className="text-xs font-label bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">{currentQuestion.marks} marks</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-on-surface leading-tight">{currentQuestion.stem}</h2>
            </div>

            <div className="space-y-3 mt-10">
              {['A', 'B', 'C', 'D'].map((key) => {
                const optText = (currentQuestion as any)[`option_${key.toLowerCase()}`];
                if (!optText) return null;
                const selected = answers[currentQuestion.id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(currentQuestion.id, key)}
                    className={`w-full p-6 rounded-2xl text-left transition-all border-2 ${
                      selected ? "border-primary bg-primary/5 text-on-surface shadow-sm" : "border-outline-variant/20 bg-surface-container hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold ${
                        selected ? "border-primary bg-primary text-white" : "border-outline text-on-surface-variant"
                      }`}>
                        {key}
                      </div>
                      <span className="flex-1 text-lg font-medium">{optText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-12 pt-8 border-t border-outline-variant/10">
              <Button variant="secondary" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0} className="rounded-xl px-6">
                <span className="material-symbols-outlined">arrow_back</span> Previous
              </Button>
              <Button variant="secondary" onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex === questions.length - 1} className="rounded-xl px-6">
                Next <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 h-fit">
            <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-6 font-bold">Navigational Matrix</h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(idx)}
                  className={`aspect-square text-sm font-bold rounded-xl transition-all border-2 ${
                    idx === currentIndex ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-110" : answers[q.id] ? "bg-secondary-container border-secondary/20 text-on-secondary-container" : "bg-surface-container border-transparent"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in min-h-[80vh]">
      <header className="space-y-4 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface text-transparent bg-clip-text academic-gradient">Practice Arena</h1>
        <p className="text-on-surface-variant text-lg font-notes italic">Sharpen your problem-solving reflexes under exam conditions.</p>
      </header>

      <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl w-fit border border-outline-variant/10">
        {["daily", "subjects", "mocks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab ? "bg-white dark:bg-surface shadow-md text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "daily" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/10 group hover:border-primary/30 transition-all">
            <div className="p-4 bg-primary/10 w-fit text-primary rounded-2xl mb-8 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">timer</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-4 text-on-surface">Daily Sprint</h2>
            <p className="text-on-surface-variant mb-10 text-lg">A randomized 15-minute challenge to verify your conceptual synthesis.</p>
            <Button variant="primary" onClick={() => startQuiz("algo", "daily", 15)} disabled={quizLoading} className="rounded-full px-12 py-7 text-xl shadow-xl shadow-primary/10 academic-gradient">
              {quizLoading ? "Loading..." : "Commence Synthesis"}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "subjects" && (
        <div>
          {subjectsLoading ? (
            <div className="py-20 text-center animate-pulse"><span className="material-symbols-outlined text-6xl text-primary/30">sync</span></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject) => (
                <div key={subject.id} className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 hover:shadow-2xl transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">{subject.icon || "folder"}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-on-surface mb-3">{subject.name}</h3>
                  <p className="text-on-surface-variant mb-10 line-clamp-2">Master {subject.name} with focused module practice.</p>
                  <Button variant="primary" onClick={() => startQuiz(subject.id)} disabled={quizLoading} className="w-full rounded-full py-6 text-lg academic-gradient">
                    Start Session
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "mocks" && (
        <div className="text-center py-20 bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-7xl text-on-surface-variant/20 mb-6">lock</span>
          <h3 className="text-2xl font-bold text-on-surface mb-3">Locked Matrix</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto">Pro subscription required for complete mock curriculum access.</p>
        </div>
      )}
    </div>
  );
}
