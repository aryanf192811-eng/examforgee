import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { fetchSubjects, startQuiz, submitQuiz, saveQuiz } from "../lib/api";
import type {
  SubjectResponse,
  QuizSessionResponse,
  QuizSubmitResponse,
} from "../types";

export function Practice() {
  const [activeTab, setActiveTab] = useState<"daily" | "subjects" | "mocks">(
    "daily",
  );
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizSessionResponse | null>(null);
  const [results, setResults] = useState<QuizSubmitResponse | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load subjects when subjects tab is opened
  useEffect(() => {
    if (activeTab === "subjects") {
      async function load() {
        try {
          setSubjectsLoading(true);
          const data = await fetchSubjects();
          setSubjects((Array.isArray(data) ? data : []).filter((s) => s.is_published));
        } catch (err) {
          console.error("Failed to load subjects:", err);
        } finally {
          setSubjectsLoading(false);
        }
      }
      load();
    }
  }, [activeTab]);

  // Periodic save to Redis (every 30s)
  useEffect(() => {
    if (quiz && !results) {
      const interval = setInterval(() => {
        saveQuiz({
          session_id: quiz.session_id,
          answers,
          flags,
        }).catch(err => console.error("Auto-save failed:", err));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [quiz, answers, flags, results]);

  const startDailyQuiz = async () => {
    try {
      setQuizLoading(true);
      setResults(null);
      const session = await startQuiz({
        count: "15",
        mode: "custom"
      });
      setQuiz(session);
      setAnswers({});
      setFlags([]);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to start quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const startSubjectQuiz = async (subjectId: string) => {
    try {
      setQuizLoading(true);
      setResults(null);
      const session = await startQuiz({
        subject_ids: subjectId,
        count: "30",
        mode: "custom"
      });
      setQuiz(session);
      setAnswers({});
      setFlags([]);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to start quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const submitCurrentQuiz = async () => {
    if (!quiz) return;
    try {
      setQuizLoading(true);
      // Final save before submit
      await saveQuiz({
        session_id: quiz.session_id,
        answers,
        flags,
      });
      const result = await submitQuiz({
        session_id: quiz.session_id,
      });
      setResults(result);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlags((prev) =>
      (Array.isArray(prev) ? prev : []).includes(questionId)
        ? prev.filter((q) => q !== questionId)
        : [...prev, questionId],
    );
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < ((Array.isArray(quiz?.questions) ? quiz?.questions : []).length)) {
      setCurrentIndex(index);
    }
  };

  const currentQuestion = quiz?.questions[currentIndex];

  // Results View
  if (results) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in space-y-10">
        <header className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-on-surface">Synthesis Complete</h1>
          <p className="text-on-surface-variant font-notes italic">Performance analysis for session {results.session_id.slice(0,8)}</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-3xl font-display font-bold text-primary">{results.marks_obtained.toFixed(2)}</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-1">Score</div>
          </div>
          <div className="bg-white dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-3xl font-display font-bold text-on-surface">{Math.round(results.accuracy_pct)}%</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-1">Accuracy</div>
          </div>
          <div className="bg-white dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-3xl font-display font-bold text-on-surface">{results.correct}</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-1">Correct</div>
          </div>
          <div className="bg-white dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 text-center">
            <div className="text-3xl font-display font-bold text-on-surface">{results.incorrect}</div>
            <div className="text-xs uppercase tracking-widest text-on-surface-variant font-label mt-1">Incorrect</div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
          <h3 className="font-display text-xl font-bold mb-6">Subject Breakdown</h3>
          <div className="space-y-6">
            {(Array.isArray(results.subject_analysis) ? results.subject_analysis : []).map((s) => (
              <div key={s.subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{s.subject}</span>
                  <span className="text-on-surface-variant">{s.marks_obtained.toFixed(2)} / {s.marks_possible} marks</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${s.accuracy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="primary" onClick={() => { setQuiz(null); setResults(null); }} className="rounded-full px-12 py-6 text-lg">
            Return to Arena
          </Button>
        </div>
      </div>
    );
  }

  // Quiz view
  if (quiz && currentQuestion) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuiz(null)}
              className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Exit Quiz
            </button>
            <div>
              <p className="text-sm font-label text-on-surface-variant">
                Question {currentIndex + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={submitCurrentQuiz}
            disabled={quizLoading}
            className="rounded-full"
          >
            {quizLoading ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-xs font-label bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentQuestion.type}
                  </span>
                  <span className="text-xs font-label bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs font-label bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
                    {currentQuestion.marks} marks
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-on-surface leading-tight">
                  {currentQuestion.stem}
                </h2>
              </div>
              <button
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`p-3 rounded-xl transition-all ${
                  flags.includes(currentQuestion.id)
                    ? "bg-warning-container text-on-warning-container"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined">flag</span>
              </button>
            </div>

            <div className="space-y-3 mt-8">
              {currentQuestion.type === "MCQ" &&
                (Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((opt) => {
                  const selected = answers[currentQuestion.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswer(currentQuestion.id, opt.key)}
                      className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${
                        selected
                          ? "border-primary bg-primary/5 text-on-surface shadow-sm"
                          : "border-outline-variant/20 bg-surface-container hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-outline text-on-surface-variant"
                          }`}
                        >
                          {opt.key}
                        </div>
                        <span className="flex-1">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              
              {currentQuestion.type === "NAT" && (
                <div className="mt-4">
                  <input 
                    type="number"
                    step="any"
                    placeholder="Enter numerical value..."
                    className="w-full p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface-container focus:border-primary outline-none transition-all font-mono"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-12 pt-8 border-t border-outline-variant/10">
              <Button
                variant="secondary"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="rounded-xl px-6"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={currentIndex === quiz.questions.length - 1}
                className="rounded-xl px-6"
              >
                Next
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 h-fit space-y-6">
            <div>
              <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
                Navigational Matrix
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {(Array.isArray(quiz.questions) ? quiz.questions : []).map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`aspect-square text-xs font-bold rounded-lg transition-all border ${
                      idx === currentIndex
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-110"
                        : answers[q.id]
                          ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                          : flags.includes(q.id)
                            ? "bg-warning-container text-on-warning-container border-warning/20"
                            : "bg-surface-container border-outline-variant/50 hover:bg-surface-container-high"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 space-y-3 text-xs border-t border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-on-surface-variant">Active Focal Point</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                <span className="text-on-surface-variant">Synthesis Commenced</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning-container"></div>
                <span className="text-on-surface-variant">Marked for Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative min-h-[80vh]">
      <header className="space-y-4 mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">
          Practice Arena
        </h1>
        <p className="text-on-surface-variant text-lg font-notes italic">
          Sharpen your intellect under exam conditions.
        </p>
      </header>

      <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit border border-outline-variant/10">
        {(Array.isArray(["daily", "subjects", "mocks"]) ? ["daily", "subjects", "mocks"] : []).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "daily" | "subjects" | "mocks")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-surface shadow-sm text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "daily" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[120px]">
                local_fire_department
              </span>
            </div>
            <div className="p-3 bg-primary w-fit text-white rounded-xl mb-6 shadow-md shadow-primary/20">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3 text-on-surface">
              Daily Sprint
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-md">
              A focused 15-minute mock test covering mixed topics to keep your
              problem-solving reflexes sharp.
            </p>
            <Button
              variant="primary"
              onClick={startDailyQuiz}
              disabled={quizLoading}
              className="rounded-full px-8 py-6 text-lg w-full sm:w-auto shadow-lg shadow-primary/20"
            >
              {quizLoading ? "Loading..." : "Start Synthesis"}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "subjects" && (
        <div>
          {subjectsLoading ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined animate-spin text-6xl text-primary/30">
                sync
              </span>
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(subjects) ? subjects : []).map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white dark:bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                    {subject.icon?.includes("<svg") ? (
                      <div dangerouslySetInnerHTML={{ __html: subject.icon }} className="w-8 h-8" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl">
                        {subject.icon || "folder"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-4">
                    {subject.chapter_count} chapters · {subject.progress_pct}%
                    complete
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => startSubjectQuiz(subject.id)}
                    disabled={quizLoading}
                    className="w-full rounded-full"
                  >
                    {quizLoading ? "Loading..." : "Start Practice"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
                account_tree
              </span>
              <h3 className="text-xl font-bold text-on-surface">
                No Subjects Available
              </h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mt-2">
                Published subjects will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "mocks" && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
            fact_check
          </span>
          <h3 className="text-xl font-bold text-on-surface">
            Full Length Mocks Locked
          </h3>
          <p className="text-on-surface-variant max-w-sm mx-auto mt-2">
            Pro subscription required to access the complete editorial mock
            curriculum.
          </p>
        </div>
      )}
    </div>
  );
}
