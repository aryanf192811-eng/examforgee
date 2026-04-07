// ExamForge — Unified TypeScript Interfaces
// Strictly aligned with backend Pydantic models in app/models/*.py

// ── User & Profile Models ──────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: "free" | "pro" | "admin";
  college: string | null;
  gate_year: number | null;
  target_score: number | null;
  created_at: string | null;

  // Computed stats
  total_points: number;
  chapters_completed: number;
  quizzes_taken: number;
  current_streak: number;
  study_hours: number;
}

export interface SessionResponse {
  profile_id: string;
  role: string;
  name: string;
  email: string;
  is_new_user: boolean;
}

export interface ProfileUpdateRequest {
  name?: string;
  college?: string;
  gate_year?: number;
  target_score?: number;
}

export interface AvatarUploadResponse {
  avatar_url: string;
  ok: boolean;
}

// ── Subject & Chapter Models (Notes) ───────────────────────────────────

export interface SubjectResponse {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
  is_published: boolean;
  order_index: number;
  chapter_count: number;
  completed_chapters: number;
  progress_pct: number;
}

export interface ChapterResponse {
  id: string;
  subject_id: string;
  slug: string;
  title: string;
  order_index: number;
  is_published: boolean;
  has_notes: boolean;
  user_status: "not_started" | "in_progress" | "done";
  time_spent_s: number;
}

export interface NoteUrlResponse {
  signed_url: string;
  chapter_id: string;
  cached: boolean;
}

export interface NoteProgressRequest {
  chapter_id: string;
  status: "not_started" | "in_progress" | "done";
  time_spent_s: number;
}

export interface NoteProgressResponse {
  ok: boolean;
}

// ── Practice (Quiz & Flashcard) Models ───────────────────────────────

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: "MCQ" | "NAT" | "MSQ";
  marks: number;
  stem: string;
  options: QuizOption[];
  subject: string;
  chapter?: string;
  category?: string; // New field
  difficulty: "easy" | "medium" | "hard";
  is_pyq: boolean;
  gate_year?: number;
}

export interface QuizSessionResponse {
  session_id: string;
  questions: QuizQuestion[];
  server_deadline?: string;
  question_count: number;
}

export interface QuestionResult {
  question_id: string;
  user_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  marks_awarded: number;
  explanation?: string;
}

export interface SubjectAnalysis {
  subject: string;
  total_questions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  marks_obtained: number;
  marks_possible: number;
  accuracy_pct: number;
}

export interface QuizSubmitResponse {
  session_id: string;
  total_marks: number;
  marks_obtained: number;
  total_questions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy_pct: number;
  negative_marks: number;
  time_taken_s?: number;
  question_results: QuestionResult[];
  subject_analysis: SubjectAnalysis[];
}

export interface FlashcardResponse {
  id: string;
  question_id: string;
  front: string;
  back: string;
  subject: string;
  chapter?: string;
  ease_factor: number;
  interval: number;
  next_review: string;
  review_count: number;
}

export interface FlashcardDueResponse {
  due_count: number;
  flashcards: FlashcardResponse[];
}

export interface FlashcardReviewResponse {
  ok: boolean;
  next_review: string;
  new_interval: number;
  new_ease_factor: number;
}

// ── Shared Types ───────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  avatar_url: string | null;
  college: string | null;
  total_points: number;
  weekly_points: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  scope: string;
  entries: LeaderboardEntry[];
  total_entries: number;
  current_user_rank: number | null;
  page: number;
  limit: number;
}

export interface DoubtCreateRequest {
  chapter_id: string;
  subject_name: string;
  selected_text: string;
  question: string;
}

export interface BookmarkResponse {
  id: string;
  chapter_id: string;
  chapter_title: string;
  created_at: string;
}


export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
