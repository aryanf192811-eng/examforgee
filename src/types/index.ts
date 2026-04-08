/* ══════════════════════════════════════════════════════════════
   ExamForge Type System — Synchronized with Backend Pydantic Models
   ══════════════════════════════════════════════════════════════ */

// ── Auth & Profile ───────────────────────────────────────────────────

export interface SessionRequest {
  id_token: string;
}

export interface SessionResponse {
  profile_id: string;
  role: string;
  name: string;
  email: string;
  is_new_user: boolean;
}

export interface ProfileResponse {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string | 'free' | 'pro' | 'admin';
  college: string | null;
  gate_year: number | null;
  target_score: number | null;
  created_at?: string;
  // Computed stats
  total_points: number;
  chapters_completed: number;
  quizzes_taken: number;
  current_streak: number;
  study_hours: number;
  accuracy_pct: number;
  activity_logs?: Record<string, number>;
  study_sessions?: Array<{
    date: string;
    duration_min: number;
    questions_attempted: number;
  }>;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  college?: string;
  gate_year?: number;
  target_score?: number;
}

export interface AuthSyncPayload {
  id_token: string;
}

export interface UserStats {
  total_points: number;
  current_streak: number;
  accuracy_rate: number;
  rank?: number;
}

// ── Subjects & Chapters ──────────────────────────────────────────────

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

export interface SubjectListResponse {
  subjects: SubjectResponse[];
}

export interface ChapterResponse {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  has_notes: boolean;
  user_status: 'not_started' | 'in_progress' | 'done';
  time_spent_s: number;
  notes_url?: string;
}

export interface ChapterListResponse {
  subject_id: string;
  chapters: ChapterResponse[];
}

// ── Notes ────────────────────────────────────────────────────────────

export interface NoteProgressRequest {
  chapter_id: string;
  status: 'not_started' | 'in_progress' | 'done';
  time_spent_s: number;
}

// ── Practice / Quiz ──────────────────────────────────────────────────

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  type: 'MCQ' | 'NAT';
  subject_slug: string;
  chapter_slug: string;
  difficulty: string;
  marks: number;
  is_pyq: boolean;
  gate_year?: number;
  options: QuizOption[];
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation?: string;
}

export interface QuizSessionResponse {
  session_id: string;
  questions: QuizQuestion[];
  server_deadline?: string;
  question_count: number;
}

export interface QuizSaveRequest {
  session_id: string;
  answers: Record<string, string>;
  flags: string[];
}

export interface QuizSubmitRequest {
  session_id: string;
}

export interface QuestionResult {
  question_id: string;
  user_answer?: string;
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

export interface ActiveSession {
  id: string;
  type: string;
  question_count: number;
  answered_count: number;
  started_at: string;
  server_deadline?: string;
}

export interface ActiveSessionResponse {
  has_active: boolean;
  session?: ActiveSession;
}

// ── Flashcards ───────────────────────────────────────────────────────

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

export interface FlashcardReviewRequest {
  flashcard_id: string;
  quality: number; // 0-5
}

export interface FlashcardReviewResponse {
  ok: boolean;
  next_review: string;
  new_interval: number;
  new_ease_factor: number;
}

// ── Leaderboard ──────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  avatar_url?: string;
  college?: string;
  total_points: number;
  weekly_points: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  scope: string; // weekly | all_time | college
  entries: LeaderboardEntry[];
  total_entries: number;
  current_user_rank?: number;
  page: number;
  limit: number;
}

// ── Bookmarks ───────────────────────────────────────────────────────

export interface BookmarkResponse {
  id: string;
  chapter_id: string;
  chapter_title: string;
  subject_slug: string;
  section_id: string;
  section_title: string;
  anchor_slug: string;
  created_at: string;
}

export interface BookmarkListResponse {
  bookmarks: BookmarkResponse[];
}

export interface BookmarkCreateRequest {
  chapter_id: string;
  section_id: string;
  section_title: string;
}

// ── Doubts ───────────────────────────────────────────────────────────

export interface DoubtRequest {
  chapter_title: string;
  subject_name: string;
  selected_text: string;
  question: string;
}

export interface DoubtResponse {
  answer: string;
}

// ── API Error (RFC 7807) ──────────────────────────────────────────────

export interface ApiErrorBody {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}
