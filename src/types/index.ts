// ExamForge — TypeScript Interfaces
// Sourced from examforge-api-contract.ts + frontend needs

// ── API Response Types ──────────────────────────────────────────────────

export interface SubjectResponse {
  id: string;
  slug: string;
  name: string;
  icon: string;
  is_published: boolean;
  exam_weight_pct: number;
}

export interface ChapterResponse {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  gate_weightage: number;
  subject_id: string;
}

export interface TopicResponse {
  id: string;
  name: string;
  slug: string;
  chapter_id: string;
}

export interface QuestionResponse {
  id: string;
  type: 'MCQ' | 'NAT' | 'MSQ';
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  question_text: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option?: string;
  correct_options?: string[];
  nat_answer_min?: number;
  nat_answer_max?: number;
  nat_unit?: string;
  explanation: string;
  gate_year: number | null;
  is_pyq: boolean;
  tags: string[];
}

export interface FlashcardResponse {
  id: string;
  front: string;
  back: string;
  topic_id: string;
  next_review: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
}

export interface NoteUrlResponse {
  signed_url: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_points: number;
  weekly_points: number;
  rank: number;
}

export interface QuizSessionResponse {
  session_id: string;
  questions: QuestionResponse[];
  current_index: number;
  time_left: number;
}

export interface QuizSubmitResponse {
  score: number;
  correct: number;
  wrong: number;
  unattempted: number;
  time_taken: number;
}

export interface UserProgressResponse {
  subjects: Record<string, {
    completion_pct: number;
    questions_attempted: number;
  }>;
}

export interface JudgeResponse {
  stdout: string | null;
  stderr: string | null;
  exit_code: number | null;
}

export interface DoubtResponse {
  answer: string;
}

export interface BookmarkResponse {
  id: string;
  chapter_id: string;
  chapter_title: string;
  created_at: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  display_name: string;
  role: 'student' | 'admin' | 'free' | 'pro';
  avatar_url: string | null;
  college: string | null;
}

// ── API Request Types ──────────────────────────────────────────────────

export interface BookmarkCreateRequest {
  chapter_id: string;
  section_id: string;
  section_title: string;
}

export interface DoubtCreateRequest {
  chapter_id: string;
  subject_name: string;
  selected_text: string;
  question: string;
}

export interface JudgeSubmitRequest {
  language: string;
  source_code: string;
  stdin: string;
}

export interface QuizStartRequest {
  subject_id: string;
  chapter_id?: string;
  question_count?: number;
  type?: string;
}

export interface QuizSaveRequest {
  session_id: string;
  answers: Record<string, string>;
  flags: string[];
}

export interface FlashcardReviewRequest {
  flashcard_id: string;
  quality: number;
}

export interface ProfileUpdateRequest {
  display_name?: string;
  college?: string;
  avatar_url?: string;
}

// ── Practice Config ──────────────────────────────────────────────────

export interface PracticeConfig {
  questions: number;
  tags: string[];
  years: number[];
  types: string[];
}

// ── API Endpoints ──────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  AUTH_SESSION: '/api/auth/session',
  SUBJECTS: '/api/subjects',
  CHAPTERS: (slug: string) => `/api/subjects/${slug}/chapters`,
  PRACTICE_CONFIG: (slug: string) => `/api/subjects/${slug}/practice-config`,
  NOTES_URL: (chapterId: string) => `/api/notes/${chapterId}/url`,
  QUESTIONS: '/api/questions',
  BOOKMARKS: '/api/bookmarks',
  BOOKMARK_DELETE: (id: string) => `/api/bookmarks/${id}`,
  DOUBTS_ASK: '/api/doubts/ask',
  QUIZ_START: '/api/quiz/start',
  QUIZ_SAVE: '/api/quiz/save',
  QUIZ_SUBMIT: '/api/quiz/submit',
  FLASHCARDS: '/api/flashcards',
  FLASHCARD_REVIEW: (id: string) => `/api/flashcards/${id}/review`,
  JUDGE_SUBMIT: '/api/judge/submit',
  LEADERBOARD: '/api/leaderboard',
  PROFILE: '/api/profile',
  PROGRESS: '/api/progress',
  EXPORT_PROGRESS: '/api/export/progress',
  HEALTH: '/health',
} as const;

// ── UI Types ──────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
