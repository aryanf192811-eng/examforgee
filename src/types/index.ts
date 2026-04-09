// ExamForge — Unified TypeScript Interfaces
// Strictly aligned with new Dual-Database Schema (SQLite + Supabase)

// ── User & Profile Models (Supabase) ──────────────────────────────────────

export interface UserProfile {
  id: string;         // Firebase UID
  email: string;
  name: string;
  role: "free" | "pro" | "admin";
  bio: string;
  avatar_url: string | null;
  streak_days: number;
  total_score: number;
  last_active_at: string;
  created_at: string;
}

export interface SessionResponse {
  uid: string;
  email: string;
  profile_id: string;
  role: string;
  name: string;
}

// ── Content Models (SQLite) ──────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  slug: string;
  category: "GATE" | "SKILL";
  icon: string;
  description: string;
  order_index: number;
}

export interface Chapter {
  id: string;
  subject_id: string;
  slug: string;
  title: string;
  order_index: number;
  has_notes: boolean;
  notes_file: string | null;
  has_questions: boolean;
  
  // Progress (merged at runtime in frontend or backend)
  progress_pct?: number;
  completed?: boolean;
}

// ── Practice Models (SQLite / Supabase) ───────────────────────────────

export interface Question {
  id: string;
  subject_id: string;
  chapter_id?: string;
  stem: string;
  type: "MCQ" | "MSQ" | "NAT";
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option?: string;    // 'A','B','C','D'
  correct_options?: string;   // JSON array string '["A","C"]'
  nat_answer_min?: number;
  nat_answer_max?: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  gate_year?: number;
  marks: number;
  is_pyq: boolean;
}

export interface QuizSession {
  id: string;
  user_id: string;
  subject_id: string;
  chapter_id?: string;
  mode: string;
  score: number;
  correct_count: number;
  total_questions: number;
  time_taken_s: number;
  started_at: string;
  completed_at?: string;
}

export interface Flashcard {
  id: string;
  subject_id: string;
  chapter_id?: string;
  front: string;
  back: string;
  tags: string[]; // Decoded from JSON
}

export interface FlashcardReview {
  id: string;
  user_id: string;
  flashcard_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_rated?: number;
}

// ── User State Models (Supabase) ───────────────────────────────────────

export interface UserProgress {
  chapter_slug: string;
  subject_id: string;
  completed: boolean;
  progress_pct: number;
  time_spent_s: number;
  last_read_at: string;
}

export interface Bookmark {
  chapter_slug: string;
  subject_id: string;
  created_at: string;
}

export interface DoubtHistory {
  id: string;
  chapter_slug: string;
  subject_id: string;
  question: string;
  answer: string;
  selected_text: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  weekly_points: number;
  name?: string;       // Joined from profiles
  avatar_url?: string; // Joined from profiles
  rank?: number;
}

// ── UI Types ───────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
