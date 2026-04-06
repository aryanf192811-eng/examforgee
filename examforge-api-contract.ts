// ExamForge API Contract — Auto-generated from backend models

// ── Shared Types ─────────────────────────────────────────────────────────────

export interface UserProfile {
    uid: string;
    email: string;
    display_name: string;
    role: string;
    avatar_url: string | null;
    college: string | null;
}

// ── Response Models ──────────────────────────────────────────────────────────

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
    type: string;
    difficulty: string;
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
    subjects: {
        [slug: string]: {
            completion_pct: number;
            questions_attempted: number;
        }
    };
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

// ── Request Models ───────────────────────────────────────────────────────────

export interface BookmarkCreateRequest {
    chapter_id: string;
    section_id: string;
    section_title: string;
}

export interface DoubtCreateRequest {
    chapter_id: string;
    selected_text: string;
    question: string;
}

export interface JudgeSubmitRequest {
    language: string;
    source_code: string;
    stdin: string;
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

// ── API Endpoints ─────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
    AUTH_SESSION: '/api/auth/session',
    
    SUBJECTS: '/api/subjects',
    CHAPTERS: (subjectId: string) => `/api/chapters/${subjectId}`,
    
    NOTES_URL: (chapterId: string) => `/api/notes/${chapterId}/url`,
    NOTES_PROGRESS: '/api/notes/progress',
    
    BOOKMARKS: '/api/bookmarks',
    BOOKMARK_DELETE: (bookmarkId: string) => `/api/bookmarks/${bookmarkId}`,
    
    DOUBTS: '/api/doubts',
    
    QUIZ_QUESTIONS: '/api/quiz/questions',
    QUIZ_ACTIVE: '/api/quiz/active',
    QUIZ_SAVE: '/api/quiz/save',
    QUIZ_SUBMIT: '/api/quiz/submit',
    
    FLASHCARDS_DUE: '/api/flashcards/due',
    FLASHCARDS_REVIEW: '/api/flashcards/review',
    
    JUDGE_SUBMIT: '/api/judge/submit',
    
    LEADERBOARD: '/api/leaderboard',
    
    PROFILE_ME: '/api/profile/me',
    PROFILE_AVATAR: '/api/profile/avatar',
    
    EXPORT: '/api/export'
} as const;
