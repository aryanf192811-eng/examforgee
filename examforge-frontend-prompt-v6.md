# ══════════════════════════════════════════════════════════════════════════════
# EXAMFORGE — FRONTEND BUILD PROMPT v6.0
# The Academic Atelier · Stitch MCP Design System · Zero Shortcuts
# ── PATCH v6: Stitch-exact design tokens · Piston code execution ·
#              Gemini AI doubts · No Redis · Material Symbols · html.dark theme
# ══════════════════════════════════════════════════════════════════════════════

---

## ❶ MISSION BRIEF

You are a senior frontend developer with 20+ years of experience building
production-grade exam platforms, design systems, and React applications.

Build the **complete frontend** for **ExamForge** — a premium GATE CSE exam
preparation platform. The design language is **The Academic Atelier** by Stitch:
*"The Digital Curator"* — exam prep as a high-end editorial experience.

**MANDATORY FIRST STEP — USE STITCH MCP SERVER:**
Before writing a single line of code, connect to the Stitch MCP server and pull
the ExamForge project. Every color token, component pattern, font pairing, and
layout structure must come from Stitch. Do not improvise. Do not approximate.
If Stitch MCP gives you a value, that value is law.

**Non-negotiable rules before you begin:**
1. NEVER use `any` TypeScript type — use `unknown` then narrow
2. NEVER use placeholder boxes or lorem ipsum — build real, complete components
3. NEVER deviate from Stitch design tokens — pull them from MCP server
4. NEVER expose signed Supabase URLs in client state, devtools, or console
5. NEVER add watermarks or overlays inside notes content
6. NEVER lock individual notes — role-based at login level only
7. NEVER re-style the sacred paper content area — `#faf7f2` bg + Lora + `#1a1a1a` ink
8. NEVER use `alert()`, `confirm()`, `prompt()` — use Modal and Toast
9. NEVER use `<form>` HTML element — use `<div role="form">` with React handlers
10. NEVER use lucide-react for any visible UI icon — use Material Symbols Outlined only
11. NEVER call DOMPurify.sanitize() without DOMPURIFY_KATEX_CONFIG on notes
12. NEVER use dimension polling for DevTools detection — use debugger trap
13. Every async state needs a skeleton loader. No spinners alone.
14. Every destructive action needs a confirmation modal.

---

## ❷ TECH STACK (LOCKED)

```
Frontend:       React 18 + Vite + TypeScript
Styling:        Tailwind CSS v3 — darkMode: "class" — html.dark toggle
State:          Zustand (never store signed URLs)
Auth:           Firebase Auth (Email/Password + Google OAuth)
                Roles: "student" | "admin" | "free" | "pro"
DB + Storage:   Supabase (PostgreSQL + private Storage bucket: notes-content)
Animations:     Framer Motion
Charts:         Recharts
Icons:          Material Symbols Outlined ONLY (Google font, NOT an npm package)
Fonts:          Fraunces · Newsreader · Inter · Lora · Fira Code (all Google Fonts)
Math:           KaTeX CSS loaded globally (notes have pre-rendered KaTeX HTML)
Sanitization:   DOMPurify with KaTeX-safe config (DOMPURIFY_KATEX_CONFIG)
Code Editor:    @monaco-editor/react
Code Execution: Piston API (POST https://emkc.org/api/v2/piston/execute — no key needed)
                ← Judge0 is REMOVED. Piston is the replacement.
AI Doubts:      Backend calls Gemini 1.5 Flash via /api/doubts/ask
                ← Anthropic is REMOVED. Gemini is the backend provider.
Draggable:      react-draggable (virtual calculator)
PWA:            vite-plugin-pwa
```

---

## ❸ DESIGN SYSTEM — THE ACADEMIC ATELIER

**Pull this entire section from Stitch MCP server first. Values below are the
exact tokens extracted from the Stitch project files — treat as ground truth.**

### 3A — Theme Architecture

Two themes, one toggle. Stored in `localStorage` key `ef_theme`.
Applied by adding/removing `dark` class on `<html>` element.
Default: `dark` (Tokyo Night).

```
DARK:  "Tokyo Night" — deep navy-purple, nocturnal editorial studio
LIGHT: "Sakura Pastel" — warm ivory-rose, airy scholarly warmth
```

Theme flash prevention — MUST be in `index.html` BEFORE the React script tag:
```html
<script>
  (function() {
    const t = localStorage.getItem('ef_theme') || 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  })();
</script>
```

### 3B — Complete Color Token System

**Tailwind config colors — wire to CSS variables for dynamic theme switching:**

```js
// tailwind.config.js — exact Stitch tokens
colors: {
  // Surfaces
  "surface-dim":               "var(--color-surface-dim)",
  "surface":                   "var(--color-surface)",
  "surface-bright":            "var(--color-surface-bright)",
  "surface-container-lowest":  "var(--color-surface-container-lowest)",
  "surface-container-low":     "var(--color-surface-container-low)",
  "surface-container":         "var(--color-surface-container)",
  "surface-container-high":    "var(--color-surface-container-high)",
  "surface-container-highest": "var(--color-surface-container-highest)",
  "surface-variant":           "var(--color-surface-variant)",
  "background":                "var(--color-background)",
  // Primary
  "primary":                   "var(--color-primary)",
  "primary-dim":               "var(--color-primary-dim)",
  "primary-fixed":             "var(--color-primary-fixed)",
  "primary-fixed-dim":         "var(--color-primary-fixed-dim)",
  "primary-container":         "var(--color-primary-container)",
  "on-primary":                "var(--color-on-primary)",
  "on-primary-container":      "var(--color-on-primary-container)",
  "inverse-primary":           "var(--color-inverse-primary)",
  // Secondary
  "secondary":                 "var(--color-secondary)",
  "secondary-dim":             "var(--color-secondary-dim)",
  "secondary-fixed":           "var(--color-secondary-fixed)",
  "secondary-fixed-dim":       "var(--color-secondary-fixed-dim)",
  "secondary-container":       "var(--color-secondary-container)",
  "on-secondary":              "var(--color-on-secondary)",
  "on-secondary-container":    "var(--color-on-secondary-container)",
  // Tertiary
  "tertiary":                  "var(--color-tertiary)",
  "tertiary-dim":              "var(--color-tertiary-dim)",
  "tertiary-fixed":            "var(--color-tertiary-fixed)",
  "tertiary-fixed-dim":        "var(--color-tertiary-fixed-dim)",
  "tertiary-container":        "var(--color-tertiary-container)",
  "on-tertiary":               "var(--color-on-tertiary)",
  // Text
  "on-background":             "var(--color-on-background)",
  "on-surface":                "var(--color-on-surface)",
  "on-surface-variant":        "var(--color-on-surface-variant)",
  "inverse-surface":           "var(--color-inverse-surface)",
  "inverse-on-surface":        "var(--color-inverse-on-surface)",
  // Borders
  "outline":                   "var(--color-outline)",
  "outline-variant":           "var(--color-outline-variant)",
  "surface-tint":              "var(--color-surface-tint)",
  // Error
  "error":                     "var(--color-error)",
  "error-dim":                 "var(--color-error-dim)",
  "error-container":           "var(--color-error-container)",
  "on-error":                  "var(--color-on-error)",
  "on-error-container":        "var(--color-on-error-container)",
}
```

**CSS variable definitions in `src/index.css`:**

```css
/* ── LIGHT THEME (Sakura Pastel) ── */
:root {
  --color-surface-dim:               #f8f9ff;
  --color-surface:                   #fdf8ff;
  --color-surface-bright:            #ffffff;
  --color-surface-container-lowest:  #ffffff;
  --color-surface-container-low:     #f1f3f9;
  --color-surface-container:         #f1f0f4;
  --color-surface-container-high:    #e8e8ec;
  --color-surface-container-highest: #e2e2e6;
  --color-surface-variant:           #e0e2ec;
  --color-background:                #fdf8ff;
  --color-primary:                   #6834eb;
  --color-primary-dim:               #7e51ff;
  --color-primary-fixed:             #a98fff;
  --color-primary-fixed-dim:         #9c7eff;
  --color-primary-container:         #b6a0ff;
  --color-on-primary:                #ffffff;
  --color-on-primary-container:      #ffffff;
  --color-inverse-primary:           #b6a0ff;
  --color-secondary:                 #006879;
  --color-secondary-dim:             #40d2ee;
  --color-secondary-fixed:           #5be2ff;
  --color-secondary-fixed-dim:       #45d4f1;
  --color-secondary-container:       #ebfaff;
  --color-on-secondary:              #ffffff;
  --color-on-secondary-container:    #001f24;
  --color-tertiary:                  #005db6;
  --color-tertiary-dim:              #0f6df3;
  --color-tertiary-fixed:            #d7e2ff;
  --color-tertiary-fixed-dim:        #77a1ff;
  --color-tertiary-container:        #d7e2ff;
  --color-on-tertiary:               #ffffff;
  --color-on-background:             #0a0e14;
  --color-on-surface:                #1a1c1e;
  --color-on-surface-variant:        #44474e;
  --color-inverse-surface:           #2f3033;
  --color-inverse-on-surface:        #f1f3fc;
  --color-outline:                   #74777f;
  --color-outline-variant:           #c4c6cf;
  --color-surface-tint:              #6834eb;
  --color-error:                     #ba1a1a;
  --color-error-dim:                 #ba1a1a;
  --color-error-container:           #ffdad6;
  --color-on-error:                  #ffffff;
  --color-on-error-container:        #410002;
}

/* ── DARK THEME (Tokyo Night) ── */
html.dark {
  --color-surface-dim:               #0a0e14;
  --color-surface:                   #0a0e14;
  --color-surface-bright:            #262c36;
  --color-surface-container-lowest:  #000000;
  --color-surface-container-low:     #0f141a;
  --color-surface-container:         #151a21;
  --color-surface-container-high:    #1b2028;
  --color-surface-container-highest: #20262f;
  --color-surface-variant:           #20262f;
  --color-background:                #0a0e14;
  --color-primary:                   #b6a0ff;
  --color-primary-dim:               #7e51ff;
  --color-primary-fixed:             #a98fff;
  --color-primary-fixed-dim:         #9c7eff;
  --color-primary-container:         #a98fff;
  --color-on-primary:                #340090;
  --color-on-primary-container:      #280072;
  --color-inverse-primary:           #6834eb;
  --color-secondary:                 #54e0fd;
  --color-secondary-dim:             #40d2ee;
  --color-secondary-fixed:           #5be2ff;
  --color-secondary-fixed-dim:       #45d4f1;
  --color-secondary-container:       #006879;
  --color-on-secondary:              #004d5a;
  --color-on-secondary-container:    #ebfaff;
  --color-tertiary:                  #6e9bff;
  --color-tertiary-dim:              #0f6df3;
  --color-tertiary-fixed:            #8eafff;
  --color-tertiary-fixed-dim:        #77a1ff;
  --color-tertiary-container:        #2778fe;
  --color-on-tertiary:               #001d4e;
  --color-on-background:             #f1f3fc;
  --color-on-surface:                #f1f3fc;
  --color-on-surface-variant:        #a8abb3;
  --color-inverse-surface:           #f8f9ff;
  --color-inverse-on-surface:        #51555c;
  --color-outline:                   #72757d;
  --color-outline-variant:           #44484f;
  --color-surface-tint:              #b6a0ff;
  --color-error:                     #ff6e84;
  --color-error-dim:                 #d73357;
  --color-error-container:           #a70138;
  --color-on-error:                  #490013;
  --color-on-error-container:        #ffb2b9;
}
```

### 3C — Typography System

```js
// tailwind.config.js fontFamily
fontFamily: {
  "display":    ["Fraunces", "serif"],      // Hero headers, major milestones
  "headline":   ["Newsreader", "serif"],    // Section headers, academic rhythm
  "body":       ["Inter", "sans-serif"],    // All UI, nav, labels, buttons
  "label":      ["Inter", "sans-serif"],    // Functional text
  "notes":      ["Lora", "serif"],          // Notes content area only
  "mono":       ["Fira Code", "monospace"], // Timer, exam codes, formulas
  "serif":      ["Fraunces", "serif"],      // Alias used in Stitch HTML
  "manuscript": ["Lora", "serif"],          // Alias used in Stitch HTML
}
```

Google Fonts link in `index.html` (exact from Stitch):
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Fira+Code:wght@300..700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### 3D — Border Radius System

```js
borderRadius: {
  DEFAULT: "0.125rem",  // chips, inputs
  lg:      "0.25rem",   // cards
  xl:      "0.5rem",    // panels
  full:    "0.75rem",   // buttons, badges
}
```

### 3E — Custom CSS Classes (in `src/index.css`)

```css
/* Material Symbols rendering — REQUIRED */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
}

/* Glass effect — navbar, overlays, floating cards */
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
}
html.dark .glass {
  background: rgba(10, 14, 20, 0.7);
  backdrop-filter: blur(16px);
}

/* Glassmorphism panel — practice, quiz overlays */
.glass-panel {
  background: rgba(15, 20, 26, 0.7);
  backdrop-filter: blur(12px);
}

/* Primary CTA gradient */
.academic-gradient {
  background: linear-gradient(135deg, #b6a0ff 0%, #7e51ff 100%);
}

/* Ambient glow for primary CTAs */
.sakura-glow {
  box-shadow: 0 0 40px rgba(182, 160, 255, 0.15);
}

/* Asymmetric clip — hero image container */
.asymmetric-clip {
  clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
}

/* Paper grain texture — subtle background noise */
.grain-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
}

/* Paper grain + ivory bg — notes content area */
.paper-grain {
  background-color: #faf7f2;
  color: #1a1a1a;
  position: relative;
}

/* Progress bar gradient — Stitch "Progress Quill" */
.progress-quill {
  background: linear-gradient(90deg, #b6a0ff 0%, #54e0fd 100%);
}

/* Tonal shift — dashboard charts */
.tonal-shift {
  background: linear-gradient(135deg, rgba(15, 20, 26, 0.5) 0%, rgba(10, 14, 20, 0.5) 100%);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-outline-variant); border-radius: 2px; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(182, 160, 255, 0.2);
  border-radius: 10px;
}

/* Selection */
::selection {
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

/* Paper content — SACRED, NEVER CHANGES WITH THEME */
.paper-content {
  background: #faf7f2 !important;
  color: #1a1a1a !important;
  font-family: 'Lora', Georgia, serif !important;
}
```

### 3F — Design Rules (from Stitch DESIGN.md — ABSOLUTE)

```
THE "NO-LINE" RULE:
  BANNED: border-b, border-t to separate sections or list items
  Section separation = background tonal shift ONLY
  List separation = spacing (space-y-3) ONLY

THE "NO-SHADOW" RULE:
  BANNED: shadow-md, shadow-lg on cards
  Depth = tonal layering: surface-container inside surface-container-low

THE "PAPER INPUT" RULE:
  Inputs: no background, border-b-2 border-outline-variant/20 ONLY
  On focus: bg-surface-container-low + border-b-primary

THE "GLASS & GRADIENT" RULE:
  Primary CTAs: academic-gradient + sakura-glow
  Floating overlays: glass or glass-panel class

THE "GHOST BORDER" RULE:
  If contrast insufficient: border border-outline-variant/15 ONLY
  Never a solid opaque border for visual grouping

NEVER use 100% black (#000000) for text — always on-surface tokens
NEVER use system fonts — one of the 6 font tokens for every text element
NEVER use rounded-full: 9999px — the full radius is 0.75rem per config
```

---

## ❹ ICON SYSTEM — MANDATORY

```
ALL icons: Material Symbols Outlined (Google font, loaded in index.html)
NO other icon library anywhere in the codebase.
NO lucide-react for any visible icon.
NO SVG icon imports.

Usage: <span className="material-symbols-outlined">icon_name</span>
Filled: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>icon_name</span>
Size: text-sm (16px), text-base (20px), text-2xl (24px), text-3xl (30px)

Icon name reference (key ones):
  dashboard · description · quiz · psychology · leaderboard · account_circle
  search · dark_mode · light_mode · add · arrow_forward · arrow_back
  check_circle · close · star · school · timer · local_fire_department
  auto_awesome · auto_stories · calculate · notifications · filter_list
  visibility · share · chevron_right · lock · radio_button_unchecked
  verified · check · menu · expand_more
```

---

## ❺ BACKEND API CONTRACT

The backend is already built. All API calls go to `VITE_API_URL` (env var).
Firebase `idToken` sent as: `Authorization: Bearer {idToken}`

```
[PUBLIC — no auth required]
GET  /health                              → { status: "ok" }
GET  /api/subjects                        → SubjectResponse[]
GET  /api/subjects/{slug}/chapters        → ChapterResponse[]

[AUTHENTICATED — Firebase token required]
GET  /api/notes/{chapter_id}/url          → { signed_url: string }
     ← Frontend fetches signed_url directly from CDN (never proxied)
     ← signed_url is NEVER stored in Zustand, NEVER logged

GET  /api/subjects/{slug}/practice-config → { questions, tags, years, types }
GET  /api/questions?subject_id=&chapter_id=&type=&year=&tag=
                                          → QuestionResponse[]
POST /api/quiz/start                      → { session_id, questions[] }
POST /api/quiz/save                       → saves state to Supabase
POST /api/quiz/submit                     → { score, correct, wrong, unattempted }

GET  /api/flashcards?subject_id=          → FlashcardResponse[]
POST /api/flashcards/{id}/review          → SM-2 update { next_review, ease_factor }

POST /api/doubts/ask                      → { answer: string }
     body: { chapter_id, subject_name, selected_text, question }
     ← Backend calls Gemini 1.5 Flash. Frontend never calls Gemini directly.

POST /api/judge/submit                    → { stdout, stderr, exit_code }
     body: { language, source_code, stdin }
     ← Backend calls Piston API. Frontend never calls Piston directly.

GET  /api/bookmarks                       → BookmarkResponse[]
POST /api/bookmarks                       → create bookmark
DELETE /api/bookmarks/{id}               → delete bookmark

GET  /api/leaderboard?branch_slug=cse    → LeaderboardEntry[]
GET  /api/profile                        → UserProfile
PUT  /api/profile                        → update profile

GET  /api/progress                       → UserProgressResponse
GET  /api/export/progress               → PDF download
```

---

## ❻ PAGE SPECIFICATIONS

### 6A — `Landing.tsx` (PUBLIC — no auth)

Structure from Stitch `landing_page/code.html`. Copy structure verbatim.

```
Navbar: fixed top-0 w-full z-40 glass h-16 px-6
  Logo: font-serif text-xl italic text-primary → "ExamForge"
  Links: hidden md:flex gap-6 → Dashboard · Notes · Practice
  Right: theme toggle (material-symbols-outlined dark_mode/light_mode) +
         "Sign In" link + "Get Started" rounded-full academic-gradient button

Hero: relative pt-32 pb-20 px-6 lg:px-24 min-h-screen flex items-center
  grain-overlay absolute inset-0 pointer-events-none
  lg:grid-cols-2 gap-12 items-center

  LEFT:
    Badge: inline-flex rounded-full bg-secondary-container text-secondary
           text-xs font-bold tracking-wider uppercase px-3 py-1 mb-6
           icon: school + "FOR GATE CSE ASPIRANTS"
    H1: font-display text-5xl lg:text-7xl font-bold leading-tight text-on-surface
        "The Art of" <br/> <span italic text-primary>Technical Precision.</span>
    Body: font-notes text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg
    CTAs: flex flex-col sm:flex-row gap-4
      Primary: rounded-full academic-gradient text-white px-8 py-4 font-bold
               sakura-glow hover:scale-[1.02] transition-transform
               → "Start Learning for Free" → <Link to="/signup">
      Secondary: rounded-full border border-outline-variant text-on-surface
                 px-8 py-4 font-semibold hover:bg-surface-container-low
                 → "Explore Curriculum"

  RIGHT (lg:block hidden):
    asymmetric-clip bg-white p-4 sakura-glow with hero image
    Floating testimonial card: absolute -bottom-8 -left-8 glass p-6 rounded-xl
      Stars + italic quote + "— AIR 42, GATE 2024"

Bento Section: py-24 px-6 bg-surface-container-low
  Header: font-display text-4xl font-bold "A Sanctuary for Deep Work"
  Grid: grid-cols-1 md:grid-cols-3 gap-6
    Notes Card (col-span-2): bg-white rounded-xl p-8 hover:bg-primary/5
    Practice Card (1 col):   bg-surface-container-high rounded-xl p-8
    Skills Card (1 col):     bg-white rounded-xl p-8 with progress-quill bar
    Leaderboard Card (col-span-2): bg-inverse-surface rounded-xl p-8

Pricing Section: py-24 px-6 — Free Scholar + Forge Pro cards
Testimonials: py-24 px-6 bg-surface-container — 3-col with quotes
Footer: full footer with links + newsletter input

Mobile Bottom Tab: lg:hidden fixed bottom-0 glass rounded-t-3xl
  sakura-glow tabs: home · description · quiz · leaderboard
```

### 6B — `Login.tsx` + `Signup.tsx` (PUBLIC)

Structure from Stitch `login/code.html`. Always rendered in dark theme context.

```
Full screen: min-h-screen bg-surface overflow-hidden relative

Ambient blobs: absolute div bg-primary-dim/10 rounded-full blur-[120px]
               absolute div bg-secondary-container/10 rounded-full blur-[100px]

Card: w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 z-10
      paper-grain rounded-full overflow-hidden

LEFT (lg:col-span-7): bg-surface-container-low p-16 flex-col justify-between
  Logo: font-serif text-5xl italic text-primary → "ExamForge"
  Tagline: font-headline text-2xl text-on-surface-variant
  Bottom decorative quote card: bg-surface-container-high/40 backdrop-blur-xl
    border-l-2 border-primary/40 rounded-xl p-8
    font-manuscript italic quote text
  Background abstract image (opacity-20)

RIGHT (lg:col-span-5): bg-surface-container p-8 md:p-14 flex-col justify-center
  "Welcome Back" / "Create Account" — font-headline text-3xl
  Subtext: font-body text-on-surface-variant

  INPUTS (THE PAPER INPUT RULE — no box, bottom border only):
    label: text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1
    input: w-full bg-transparent border-0 border-b border-outline-variant/30
           py-3 px-1 text-on-surface focus:ring-0 focus:border-primary
           font-body placeholder:text-outline-variant

  Submit: w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary
          font-label font-semibold py-4 rounded-full
          hover:shadow-[0_0_20px_rgba(182,160,255,0.3)] transition-all
          → "Enter Workspace" / "Join the Atelier"

  Divider: relative flex items-center — border-t border-outline-variant/20
           span: "or authenticate via" text-xs uppercase tracking-widest

  Google OAuth: bg-surface-container-high border border-outline-variant/10
                flex items-center gap-3 py-3.5 rounded-full
                hover:bg-surface-container-highest
                Include actual Google SVG logo (from Stitch HTML)

Footer links: absolute bottom-8 — Privacy Charter · Terms · Accessibility
              text-[10px] uppercase tracking-[0.2em] text-outline
```

### 6C — `Dashboard.tsx` (AUTHENTICATED)

Structure from Stitch `dashboard/code.html`.

```
Layout: bg-surface-dim text-on-surface font-body
        with Sidebar + TopBar shell (see Layout components)

Main: lg:ml-[240px] pt-24 pb-32 lg:pb-12 px-6 lg:px-10 min-h-screen
      max-w-7xl mx-auto space-y-12

Hero Greeting:
  flex flex-col md:flex-row justify-between items-end gap-6
  H2: font-headline text-4xl italic "Welcome back, Curator."
  Goal: "You've completed [X]% of your weekly goal."
  Focus timer pill: bg-surface-container-low px-4 py-2 rounded-full
    border border-outline-variant/10
    icon: timer text-secondary + font-mono "02:45:12 focus today"

Bento Stats Grid: grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
  Daily Goal card: bg-surface-container-low rounded-3xl p-6
    SVG circular progress ring (animated):
      stroke-dasharray 364.4 stroke-dashoffset calculated from %
    font-headline text-3xl font-bold inside ring
    "Daily Goal" text-on-surface-variant text-sm

  Forge Points card: rounded-3xl p-6
    icon: stars bg-tertiary-container/20 p-2 rounded-xl
    "+120 today" font-mono text-tertiary-fixed-dim
    "12,450" text-3xl font-headline font-bold
    hover:text-primary transition-colors on value

  Streak card: rounded-3xl p-6
    icon: local_fire_department filled text-error
    "14 Days" text-3xl font-headline
    border-b-2 border-transparent hover:border-error-dim/30

  Skill Level card: bg-surface-container-high rounded-3xl p-6
    progress bar: bg-gradient-to-r from-secondary-dim to-secondary rounded-full
    "UPGRADE LEVEL" button with arrow_forward icon

Main Workspace Grid: grid grid-cols-1 lg:grid-cols-12 gap-8
  LEFT (lg:col-span-8): Analytics
    Subject Mastery: bg-surface-container-low rounded-3xl p-8 tonal-shift
      font-headline text-lg italic "Subject Mastery"
      Recharts RadarChart wired to GET /api/progress data

    Study Velocity: bg-surface-container-low rounded-3xl p-8
      font-headline text-lg italic "Study Velocity"
      Recharts BarChart — weekly study hours from API

    Activity Forge (Heatmap): bg-surface-container-low rounded-3xl p-8
      grid of color-coded cells showing daily activity
      Legend: Less → More with bg-primary opacity variants

  RIGHT (lg:col-span-4): Quick Actions
    Upcoming Reviews card: flashcard count + due date
    Continue button: rounded-full academic-gradient
    Recent PYQ card: last attempted question
    Subject list: subject slugs with progress bars

Skeleton: All data cards show skeleton while loading
```

### 6D — `Notes.tsx` (AUTHENTICATED) — 3-panel layout

Structure from Stitch `notes_viewer/code.html`. Sacred paper content.

```
Layout: pt-16 pl-0 lg:pl-[240px] h-screen flex overflow-hidden

LEFT PANEL (xl:flex hidden — chapter nav):
  w-64 bg-slate-900/30 border-r border-outline-variant/10 p-6
  custom-scrollbar overflow-y-auto

  "Modules" font-headline text-lg italic + filter_list icon
  Chapters grouped by subject section:
    Section header: text-[10px] uppercase tracking-tighter text-on-surface-variant
    Chapter items: space-y-1
      Active: bg-primary/10 border-l-2 border-primary text-primary font-medium
              icon: auto_stories filled
      Completed: text-on-surface-variant icon: check_circle
      Locked: text-on-surface-variant/40 icon: lock
    No dividers between items — spacing only

  Progress bar at bottom: bg-primary/5 border border-primary/10 rounded-xl p-4
    "PROGRESS: 45%" + progress-quill bar

CENTER PANEL (flex-1 — THE SACRED PAPER):
  overflow-y-auto custom-scrollbar
  paper-grain class (bg: #faf7f2, text: #1a1a1a)
  max-w-3xl w-full px-8 md:px-16 py-20

  Header:
    font-mono text-xs text-primary-dim tracking-widest opacity-60
    → subject code e.g. "CS_DBMS_02.4"
    H1: font-display text-5xl italic text-slate-900 leading-tight
    Metadata: Last Modified + reading time + share button
    border-b border-black/5 pb-8

  NOTES HTML INJECTION ZONE:
    <div className="paper-content" ref={contentRef} />
    Content fetched via:
      1. GET /api/notes/{chapter_id}/url → { signed_url }
      2. fetch(signed_url) → HTML string
      3. DOMPurify.sanitize(html, DOMPURIFY_KATEX_CONFIG)
      4. contentRef.current.innerHTML = sanitized
    NEVER store signed_url anywhere
    Cache raw HTML in Cache API: key "notes-chapter-{chapterId}"

  Active Recall blocks (from Stitch):
    bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 my-8

  Loading state: skeleton cards in paper-grain area

RIGHT PANEL (xl:flex hidden — tools):
  w-72 bg-surface-container-low border-l border-outline-variant/10 p-6
  Tabs: Bookmarks · Notes · Ask AI

  Bookmark Panel: list of bookmarked passages
  User Notes: textarea with 1s debounce autosave + char counter (warn at 9,000)
  Doubt Drawer (Ask AI):
    Selected text shown
    Question input (paper input style)
    Submit → POST /api/doubts/ask → Gemini answer rendered
    Answer: font-notes text-sm leading-relaxed

Focus Mode: hides LEFT and RIGHT panels, center expands
  Button in TopBar: visibility icon + "Focus Mode"
  On mobile: also hides bottom tab bar

Offline: if cached → show "(cached)" badge in header
         if not cached → EmptyState "Not available offline"
```

### 6E — `Practice.tsx` (AUTHENTICATED)

Structure from Stitch `practice_tokyo_night/code.html`.

```
Layout: bg-background text-on-surface font-body
        TopBar (simplified, no sidebar on this page per Stitch)
        flex min-h-screen pt-16

LEFT SIDEBAR (md:flex hidden — subject/filter nav):
  w-64 bg-slate-900 py-8 sticky top-16 h-[calc(100vh-4rem)]
  border-r border-slate-800/20

  User badge: rounded-full bg-surface-container-high + avatar
  "The Curator" font-serif text-lg + "Deep Work Mode"

  Nav: Practice (active) · Skills · Leaderboard · Profile

  Filter section below nav:
    Subject selector (dropdown or list)
    Year filter chips: 2003–2024
    Type filter: MCQ · NAT · MSQ chips
    Tag chips from GET /api/subjects/{slug}/practice-config

MAIN CONTENT:
  5 tabs: PYQ Practice · Mock Test · Flashcards · Analytics · Bookmarks

  PYQ Practice tab:
    Question card: bg-surface-container rounded-3xl p-8 glass-panel
      Question number: font-mono text-xs text-outline-variant uppercase tracking-widest
      Question text: font-notes text-lg leading-relaxed text-on-surface mb-6
      Options (NO dividers between — spacing only):
        each: flex items-center gap-3 p-4 rounded-xl bg-surface-container-low
              hover:bg-surface-container-high cursor-pointer
        Active: bg-primary/10 border border-primary/30 text-primary
        Correct: bg-green-500/10 border border-green-500/30 text-green-400
        Wrong: bg-error/10 border border-error/30 text-error
      NAT: input with font-mono, paper-input style
      Explanation (after submit): paper-grain bg rounded-xl p-6 font-notes

    Navigation: Previous · Next · Submit buttons
    Progress bar: progress-quill gradient showing question progress

    Virtual Calculator (react-draggable):
      glass-panel rounded-xl p-4 shadow-lg
      font-mono display + calculator buttons
      Only shows when calculator icon in TopBar clicked

    Timer (Focus Timer):
      glass rounded-xl p-4 top-right corner
      font-mono text-2xl text-secondary-fixed-dim

  Mock Test tab:
    Full exam simulation — 65 questions, 3h timer
    Server deadline from DB (not local clock)
    Resume modal on reload if session active

  Flashcards tab:
    Card flip: 3D rotateY Framer Motion spring (stiffness 300 damping 25)
    Front: font-display text-2xl + icon
    Back: font-notes text-lg leading-relaxed
    SM-2 rating: 5 buttons (0-5) → POST /api/flashcards/{id}/review
    Progress: "X due today" font-mono

  Analytics tab:
    Recharts — accuracy by subject, time per question, weak topics
    Tag-based weakness chart (from question_tags)

  Bookmarks tab:
    List of bookmarked questions + notes
```

### 6F — `Leaderboard.tsx` (AUTHENTICATED)

Structure from Stitch `leaderboard_tokyo_night/code.html`.

```
Tabs: Global · My College · Weekly
Branch filter: CSE (default) — from GET /api/leaderboard?branch_slug=cse

Top 3 Podium:
  flex justify-center items-end gap-4 py-12
  1st: bg-primary/20 border border-primary/40 rounded-xl p-6 h-40 — crown icon
  2nd: bg-surface-container rounded-xl p-6 h-32
  3rd: bg-surface-container rounded-xl p-6 h-28
  Rank number: font-display text-4xl text-primary

Rank List (NO dividers — space-y-2 only):
  Each row: flex items-center gap-4 p-4 rounded-xl
    bg-surface-container hover:bg-surface-container-high transition-all
    Rank: font-mono text-sm text-outline
    Avatar: w-10 h-10 rounded-full border border-outline-variant/20
    Name: font-body font-semibold text-on-surface
    Points: font-mono text-primary ml-auto
    This week badge: rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5

Empty "My College": EmptyState "Be the first from your college!"
```

### 6G — `Skills.tsx` (AUTHENTICATED)

Structure from Stitch `skills_tokyo_night/code.html`.

```
Layout: split — skill list left + lesson viewer right

Skill card: bg-surface-container rounded-xl p-6 cursor-pointer
  hover:bg-surface-container-high transition-all ghost-border
  icon: material symbol for skill type
  Title: font-display text-lg font-bold
  Progress bar: h-1 rounded-full progress-quill
  "X / Y lessons" font-mono text-xs text-on-surface-variant

Lesson viewer:
  Video/content area: bg-surface-container-low rounded-xl p-8
  Code editor: @monaco-editor/react dark theme
    bg-surface-container-lowest rounded-lg
    font-mono text-sm

  Run Code button → POST /api/judge/submit (Piston backend)
    Language: cpp / python / java
    Output panel: bg-surface-container-lowest rounded-lg font-mono
    stdout: text-secondary
    stderr: text-error
    If Piston unavailable: toast "Code execution unavailable"
```

### 6H — `Profile.tsx` + `Settings.tsx` (AUTHENTICATED)

Structure from Stitch `profile_settings_tokyo_night/code.html`.

```
Layout: lg:grid-cols-[1fr_2fr] gap-8 p-6

Left card: bg-surface-container rounded-xl p-8 text-center
  Avatar: w-24 h-24 rounded-full mx-auto border-4 border-primary/30
  Name: font-display text-2xl font-bold text-on-surface
  Role badge: rounded-full px-3 py-1 bg-primary/10 text-primary
  Stats row: questions · streak · points in font-mono

Right cards (NO dividers — use spacing + bg tonal shifts):
  Account card: bg-surface-container rounded-xl p-6
    Inputs: paper-input style
    Save: academic-gradient rounded-full button

  Appearance card: theme toggle + font size preference
  Security card: change password (hidden for Google OAuth users)
  Danger Zone: "Delete Account" bg-error/10 text-error
    → confirmation modal before any action

Settings: same layout, tabs for Profile/Appearance/Security/Notifications
```

---

## ❼ DOMPURIFY KATEX CONFIG — CRITICAL

```ts
// src/lib/dompurify-config.ts
import DOMPurify from 'dompurify';

export const DOMPURIFY_KATEX_CONFIG: DOMPurify.Config = {
  ADD_TAGS: [
    'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac',
    'msubsup', 'munder', 'mover', 'munderover', 'mtable', 'mtr',
    'mtd', 'mtext', 'menclose', 'mspace', 'semantics', 'annotation',
    'annotation-xml', 'mstyle', 'mpadded', 'mphantom', 'msqrt',
    'mroot', 'merror', 'mglyph',
    'span', // KaTeX uses spans
  ],
  ADD_ATTR: [
    'xmlns', 'display', 'alttext', 'encoding', 'class', 'style',
    'aria-hidden', 'focusable', 'role', 'tabindex',
    'data-katex', 'data-token',
  ],
  FORBID_TAGS: ['script', 'style', 'link', 'meta', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  FORCE_BODY: true,
};

// ALWAYS use this — never DOMPurify.sanitize(html) alone
export const sanitizeNoteHtml = (html: string): string =>
  DOMPurify.sanitize(html, DOMPURIFY_KATEX_CONFIG);
```

---

## ❽ SECURITY — PLATFORM PROTECTION

```ts
// src/hooks/usePlatformSecurity.ts
// Debugger trap method (NOT dimension polling)
export function usePlatformSecurity() {
  useEffect(() => {
    const trap = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - start > 100) {
        document.body.innerHTML = '';
        window.location.href = '/';
      }
    };
    const interval = setInterval(trap, 1000);
    return () => clearInterval(interval);
  }, []);
}
// Call in App.tsx: usePlatformSecurity()
```

---

## ❾ LAYOUT COMPONENTS

### Sidebar (Desktop — authenticated pages)

```tsx
// src/components/layout/Sidebar.tsx
// Exact structure from Stitch dashboard/code.html <aside>

hidden lg:flex flex-col py-8 px-4
h-screen w-[240px] fixed left-0 top-0
bg-slate-950/80 backdrop-blur-xl z-50

Logo area:
  font-['Fraunces'] text-2xl italic text-[#b6a0ff] → "ExamForge"
  text-[10px] uppercase tracking-[0.2em] text-on-surface-variant → "The Digital Curator"

"New Note" button:
  w-full py-3 px-4 rounded-full
  bg-gradient-to-r from-primary to-primary-dim text-on-primary
  flex items-center justify-center gap-2
  icon: add

Nav items (use NavLink from react-router-dom for active state):
  Active:   text-primary font-bold border-r-2 border-primary bg-slate-900/40
            py-3 px-4 flex items-center gap-4
  Inactive: text-slate-400 hover:text-slate-200 hover:bg-slate-800/50
            py-3 px-4 flex items-center gap-4 transition-all duration-300

  Routes: Dashboard · Notes · Practice · Skills · Leaderboard · Profile

User card (mt-auto):
  w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20
  Name: text-xs font-bold text-on-surface
  Role: text-[10px] text-on-surface-variant
```

### TopBar (Desktop — authenticated pages)

```tsx
// src/components/layout/TopBar.tsx
// Exact structure from Stitch dashboard/code.html <header>

fixed top-0 right-0
w-full lg:w-[calc(100%-240px)] z-40
bg-slate-950/60 backdrop-blur-md (dark) | bg-white/60 backdrop-blur-md (light)
h-16 px-6 flex justify-between items-center

Left: search input (paper-input style, search icon absolute left-3)
      + optional breadcrumbs on Notes page

Right: theme toggle icon + profile avatar initials
       + optional "Focus Mode" button on Notes page
```

### Mobile Bottom Tab Bar

```tsx
// src/components/layout/BottomTabBar.tsx
// Exact structure from Stitch landing_page/code.html bottom nav

lg:hidden fixed bottom-0 left-0 w-full z-50
bg-white/90 (light) | bg-slate-950/90 (dark)
backdrop-blur-2xl rounded-t-3xl
flex justify-around items-center px-4 pb-6 pt-3
shadow-[0_-10px_40px_rgba(104,52,235,0.1)]

Tabs: home · description · quiz · leaderboard · account_circle
Active: bg-primary/10 text-primary rounded-2xl px-4 py-1
        flex flex-col items-center
Label: font-label text-[10px] uppercase tracking-tighter mt-1
```

---

## ❿ ZUSTAND STORES

```ts
// src/lib/store/authStore.ts
interface AuthStore {
  user: FirebaseUser | null;
  role: 'student' | 'admin' | 'free' | 'pro' | null;
  idToken: string | null;           // refreshed on demand, never persisted
  setUser: (user, role, token) => void;
  clearUser: () => void;
}

// src/lib/store/themeStore.ts
interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  // toggle adds/removes html.dark class + sets localStorage ef_theme
}

// src/lib/store/quizStore.ts
interface QuizStore {
  sessionId: string | null;
  questions: QuestionResponse[];
  answers: Record<string, string | string[] | number>;
  currentIndex: number;
  timeLeft: number;     // synced from server_deadline, NOT local Date.now()
  // NEVER store signed_url here
}

// src/lib/store/notesStore.ts
interface NotesStore {
  activeChapterId: string | null;
  // NOTE: signed_url is NEVER stored here
  // Raw HTML is cached in Cache API, never in Zustand
  bookmarks: BookmarkResponse[];
  userNotes: string;
}
```

---

## ⓫ API CLIENT

```ts
// src/lib/api.ts
const BASE = import.meta.env.VITE_API_URL;

// Auth header injected automatically
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getIdToken(); // Firebase current user
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}

// Notes fetch — CDN direct, signed_url consumed immediately
export async function loadNoteHtml(chapterId: string): Promise<string> {
  const { signed_url } = await apiFetch<{ signed_url: string }>(
    `/api/notes/${chapterId}/url`
  );
  // signed_url consumed here — never stored
  const html = await fetch(signed_url).then(r => r.text());
  // Cache for offline
  const cache = await caches.open('notes-v1');
  await cache.put(`notes-chapter-${chapterId}`, new Response(html));
  return sanitizeNoteHtml(html);
}

// Piston code execution — via backend proxy
export async function runCode(language: string, source_code: string, stdin = '') {
  return apiFetch<{ stdout: string; stderr: string; exit_code: number }>(
    '/api/judge/submit',
    { method: 'POST', body: JSON.stringify({ language, source_code, stdin }) }
  );
}

// Gemini doubt answering — via backend proxy
export async function askDoubt(payload: {
  chapter_id: string;
  subject_name: string;
  selected_text: string;
  question: string;
}) {
  return apiFetch<{ answer: string }>('/api/doubts/ask', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
```

---

## ⓬ ANIMATIONS (Framer Motion)

```
Page transitions:    fade + translateY(8px→0), duration 0.2s ease-out
                     <AnimatePresence> in App.tsx wrapping <Routes>
Sidebar nav items:   layout animation (layout prop on active indicator)
Stats cards:         stagger 0.05s each with variants
Flashcard flip:      rotateY 0→180, spring stiffness:300 damping:25
Focus Mode panels:   translateX off-screen, 300ms ease-out
Doubt drawer:        translateX from right, 0.2s
Toast:               slide in/out from right
Modal:               scale 0.95→1 + opacity 0→1, 0.15s
Progress bar fill:   width animate on mount, 0.6s ease-out
```

---

## ⓭ PWA & OFFLINE

```
Plugin: vite-plugin-pwa

Service Worker strategy:
  App shell:              StaleWhileRevalidate
  notes-v1 (CDN HTML):   Cache-First, 7 days
                          ← cache after fetch() in loadNoteHtml()
                          ← re-sanitize from cache at inject time
  Images:                 Cache-First, max 100 entries
  API calls:              NetworkFirst with offline fallback

Offline state:
  OfflineBanner:          amber sticky bar "You're offline. Cached content only."
  Cached chapters:        show "(cached)" badge in Notes header
  Uncached chapters:      EmptyState with reconnect message
  [Download for Offline]: pre-fetches all chapters for subject sequentially
```

---

## ⓮ EDGE CASES — ENFORCE ALL

```
[ ] CDN fetch fails → "Content unavailable. Try again." + Retry button
[ ] KaTeX MathML stripped → NEVER — always use DOMPURIFY_KATEX_CONFIG
[ ] Chapter 404 (no notes row) → toast "Notes not ready yet"
[ ] Chapter is_published=false → backend 404, same UX
[ ] Quiz reload → resume modal if active session in DB
[ ] Mock reload → timer from server_deadline, not local Date.now()
[ ] Auth token expiry mid-quiz → Firebase onIdTokenChanged auto-refresh
[ ] Notes offline → load from Cache API, re-sanitize before injection
[ ] Piston (judge) unavailable → toast + disable Run Code with message
[ ] Gemini unavailable → toast "AI doubt unavailable, try later"
[ ] KaTeX CSS must be loaded globally in index.html <link>
[ ] Image fail in notes → CSS min-height placeholder, never break layout
[ ] Focus Mode mobile → also hides bottom tab bar
[ ] Free user → pro feature → UpgradeModal, never crash
[ ] Google OAuth → hide password section in Settings
[ ] Empty leaderboard college tab → "Be the first from your college!"
[ ] User notes > 10,000 chars → warn at 9,000, block at 10,000
[ ] Multiple toasts → max 3 visible, queue the rest
[ ] Theme flash → html.dark set synchronously BEFORE React mounts
[ ] signed_url → consumed immediately, never logged, never stored
[ ] DL subject → notes 404 → "Notes not ready yet" (not published)
```

---

## ⓯ FOLDER STRUCTURE

```
examforge/
├── index.html              ← Google Fonts + Material Symbols + theme flash script
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── App.tsx             ← Router + AnimatePresence + usePlatformSecurity()
│   ├── index.css           ← CSS vars (dark + light) + custom classes
│   ├── types/index.ts      ← All TypeScript interfaces
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── supabase.ts
│   │   ├── dompurify-config.ts    ← DOMPURIFY_KATEX_CONFIG
│   │   ├── api.ts                 ← Typed fetch wrappers
│   │   ├── sm2.ts                 ← SM-2 algorithm client
│   │   ├── utils.ts
│   │   └── store/
│   │       ├── authStore.ts
│   │       ├── notesStore.ts
│   │       ├── themeStore.ts
│   │       └── quizStore.ts
│   ├── hooks/
│   │   ├── usePlatformSecurity.ts ← debugger trap
│   │   ├── useBookmarks.ts
│   │   ├── useUserNotes.ts
│   │   ├── useProgress.ts
│   │   └── useTheme.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        ← Desktop sidebar
│   │   │   ├── TopBar.tsx         ← Fixed top header
│   │   │   ├── BottomTabBar.tsx   ← Mobile bottom nav
│   │   │   └── AppShell.tsx       ← Wraps Sidebar + TopBar + children
│   │   ├── ui/
│   │   │   ├── Button.tsx         ← Primary / Secondary / Tertiary / Destructive
│   │   │   ├── Input.tsx          ← Paper input style
│   │   │   ├── Badge.tsx          ← Rounded chip
│   │   │   ├── Modal.tsx          ← Framer Motion scale + fade
│   │   │   ├── Toast.tsx          ← Slide in/out from right, max 3
│   │   │   ├── Skeleton.tsx       ← Shimmer skeleton
│   │   │   ├── EmptyState.tsx     ← Consistent empty state
│   │   │   └── ProgressBar.tsx    ← progress-quill gradient
│   │   ├── notes/
│   │   │   ├── NotesViewer.tsx    ← CDN-direct fetch + inject
│   │   │   ├── FocusModeWrapper.tsx
│   │   │   ├── ActiveRecallBlock.tsx
│   │   │   ├── CiteAskPopover.tsx ← Select text → ask AI
│   │   │   ├── DoubtDrawer.tsx    ← Right panel AI answers
│   │   │   ├── BookmarkPanel.tsx
│   │   │   └── UserNotesPanel.tsx
│   │   ├── practice/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── OptionButton.tsx
│   │   │   ├── VirtualCalculator.tsx  ← react-draggable
│   │   │   ├── FocusTimer.tsx
│   │   │   ├── FlashcardViewer.tsx
│   │   │   └── TagFilterBar.tsx
│   │   ├── dashboard/
│   │   │   ├── ProgressRing.tsx   ← SVG circular progress
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   ├── SubjectMasteryChart.tsx ← Recharts Radar
│   │   │   └── StudyVelocityChart.tsx  ← Recharts Bar
│   │   └── global/
│   │       ├── CommandPalette.tsx ← Cmd+K
│   │       ├── OfflineBanner.tsx
│   │       └── UpgradeModal.tsx
│   └── pages/
│       ├── Landing.tsx
│       ├── Login.tsx
│       ├── Signup.tsx
│       ├── Dashboard.tsx
│       ├── Notes.tsx
│       ├── Practice.tsx
│       ├── Skills.tsx
│       ├── Leaderboard.tsx
│       ├── Profile.tsx
│       └── Settings.tsx
├── tailwind.config.js
└── vite.config.ts
```

---

## ⓰ BUILD ORDER — STRICT SEQUENCE

```
PHASE 1 — Foundation (no visuals yet, all infrastructure)
  1.  index.html           — fonts, Material Symbols, theme flash script, KaTeX CSS
  2.  src/index.css        — full CSS vars (light + dark) + custom classes
  3.  tailwind.config.js   — complete token mapping + fontFamily + borderRadius
  4.  src/types/index.ts   — all TypeScript interfaces
  5.  src/lib/dompurify-config.ts  ← build BEFORE any component touches notes
  6.  src/lib/firebase.ts
  7.  src/lib/supabase.ts
  8.  src/lib/store/*.ts   — all 4 stores
  9.  src/lib/api.ts       — all typed fetch wrappers incl. loadNoteHtml, runCode, askDoubt
  10. src/lib/sm2.ts
  11. src/lib/utils.ts
  12. src/hooks/usePlatformSecurity.ts
  13. src/hooks/*.ts       — remaining hooks

PHASE 2 — UI Primitives (Stitch-styled atomic components)
  14. ui/Button.tsx
  15. ui/Input.tsx         — paper-input style
  16. ui/Badge.tsx
  17. ui/Modal.tsx
  18. ui/Toast.tsx
  19. ui/Skeleton.tsx
  20. ui/EmptyState.tsx
  21. ui/ProgressBar.tsx   — progress-quill gradient

PHASE 3 — Layout Shell
  22. layout/Sidebar.tsx   — Stitch dashboard sidebar exact
  23. layout/TopBar.tsx    — Stitch dashboard header exact
  24. layout/BottomTabBar.tsx — Stitch landing bottom nav exact
  25. layout/AppShell.tsx  — combines all three
  26. App.tsx              — Router + AnimatePresence + usePlatformSecurity()
  27. global/OfflineBanner.tsx
  28. global/CommandPalette.tsx
  29. global/UpgradeModal.tsx

PHASE 4 — Pages (Stitch HTML → JSX verbatim)
  30. pages/Landing.tsx    — from Stitch landing_page/code.html
  31. pages/Login.tsx      — from Stitch login/code.html
  32. pages/Signup.tsx     — adapted from Login
  33. dashboard/* charts   — ProgressRing, ActivityHeatmap, charts
  34. pages/Dashboard.tsx  — from Stitch dashboard/code.html
  35. notes/* components   — NotesViewer, FocusMode, Bookmarks, DoubtDrawer
  36. pages/Notes.tsx      — from Stitch notes_viewer/code.html
  37. practice/* components
  38. pages/Practice.tsx   — from Stitch practice_tokyo_night/code.html
  39. pages/Skills.tsx     — from Stitch skills_tokyo_night/code.html
  40. pages/Leaderboard.tsx — from Stitch leaderboard_tokyo_night/code.html
  41. pages/Profile.tsx    — from Stitch profile_settings_tokyo_night/code.html
  42. pages/Settings.tsx

PHASE 5 — Polish
  43. PWA config (vite-plugin-pwa)
  44. Framer Motion page transitions in App.tsx
  45. Skeleton screens for every async data load
  46. Full edge case verification
```

---

## ⓱ CRITICAL RULES — NEVER VIOLATE

```
1.  USE STITCH MCP SERVER — pull all design decisions from MCP before writing code
2.  NEVER add watermarks or overlays inside notes HTML content
3.  NEVER lock individual notes — role-based at login level only
4.  NEVER log, store, or expose signed URLs anywhere in client code
5.  NEVER construct Supabase Storage paths in frontend
6.  NEVER use <form> HTML element — use <div role="form">
7.  NEVER use any TypeScript type — use unknown then narrow
8.  NEVER use alert(), confirm(), prompt() — Modal and Toast only
9.  NEVER re-style injected notes HTML — paper-content class is sacred
10. NEVER call Piston API from frontend — only via /api/judge/submit backend proxy
11. NEVER call Gemini from frontend — only via /api/doubts/ask backend proxy
12. NEVER call DOMPurify.sanitize() without DOMPURIFY_KATEX_CONFIG on notes
13. NEVER use dimension polling for DevTools detection — debugger trap only
14. NEVER use lucide-react or any npm icon package for visible UI icons
15. ALWAYS apply html.dark from localStorage synchronously before React mounts
16. ALWAYS use removeAttribute on html.classList, never setAttribute with empty string
17. ALWAYS debounce user notes autosave (1s)
18. ALWAYS show skeleton screens for every async data load
19. ALWAYS show EmptyState for empty lists
20. ALWAYS show confirmation modal for destructive actions
21. ALWAYS preserve returnUrl across auth redirects
22. The paper aesthetic (#faf7f2 bg, Lora font, #1a1a1a ink) is for notes ONLY
```

---

*ExamForge Frontend Build Prompt v6.0 — The Academic Atelier · Stitch MCP Design System*
*Stack: React 18 · Vite · Tailwind CSS (html.dark) · Firebase Auth · Supabase*
*AI: Gemini 1.5 Flash (backend) · Code: Piston API (backend proxy) · No Redis · No Judge0*
*Icons: Material Symbols Outlined · Design: Stitch MCP Server · Fonts: Fraunces/Newsreader/Inter/Lora/Fira Code*
*Authored for Aryan's ExamForge platform — April 2026.*
