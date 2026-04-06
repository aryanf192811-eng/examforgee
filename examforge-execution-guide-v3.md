# ══════════════════════════════════════════════════════════════════════════════
# EXAMFORGE — EXECUTION GUIDE v3
# Your personal step-by-step build guide · Read top to bottom · Never skip steps
# Written for: Aryan · April 2026
# Updated: Redis removed · Judge0 removed · Piston added · Gemini added ·
#          Frontend v6 with Stitch MCP design system
# ══════════════════════════════════════════════════════════════════════════════

---

## BEFORE YOU START — READ THIS ONCE

You have all artifacts. Here is the current state:

| What | File | Status |
|---|---|---|
| Backend spec | `examforge-backend-prompt-v2.md` | ✅ Ready (use with overrides in Step 1.2) |
| **Frontend spec** | `examforge-frontend-prompt-v6.md` | ✅ Ready — USE THIS, not v5 |
| PYQ seed spec | `examforge-pyq-universal-prompt-v2.md` | ✅ Reference only |
| Master binding | `examforge-master-binding-prompt-v2.md` | ✅ Ready |
| SQL seed files | `examforge-backend/db/seeds/` (126 files) | ✅ Done |
| Notes HTML files | `Gate Cse notes/` (25 files) | ✅ Done |
| Stitch design zip | `stitch_ui_ux_design_project.zip` | ✅ Required for frontend |
| **Backend code** | `examforge-backend/` | ⚠️ Built — needs audit |
| **Frontend code** | `examforge/` | ❌ Rebuild with v6 prompt |

**Current confirmed stack (what is actually running):**
```
✅ Firebase Auth          — user authentication
✅ Supabase               — PostgreSQL DB + Storage
✅ Piston API             — code execution (no key, free)
✅ Gemini 1.5 Flash       — AI doubt answering (free, aistudio.google.com)
✅ Render                 — backend deployment (free tier)
✅ Vercel                 — frontend deployment (free)
❌ Redis / Upstash        — REMOVED (Supabase handles quiz state directly)
❌ Judge0                 — REMOVED (Piston replaced it)
❌ Anthropic API          — REMOVED (Gemini replaced it)
```

The build order is fixed. Do not jump ahead.

```
PHASE 1 → Audit & Clean Backend (already built — needs Redis/Judge0 removed)
PHASE 2 → Extract API Contract
PHASE 3 → Build Frontend with Stitch MCP Design System
PHASE 4 → Deploy & Connect Everything
PHASE 5 → Bind Notes + Seeds to Live DB
```

Keep all prompt files in one folder. Never modify them — they are source of truth.

---

---

# PHASE 1 — AUDIT & CLEAN THE BACKEND

## What the backend does (actual current stack)

```
FastAPI + Python 3.11
Firebase Admin SDK — token verification
Supabase — all data (questions, notes, flashcards, quiz state, leaderboard)
Piston API — POST https://emkc.org/api/v2/piston/execute (no key, no auth header)
Gemini 1.5 Flash — via google-generativeai package
Render — deployment ($PORT injected automatically)
slowapi — rate limiting (in-memory, no Redis)
NO Redis/Upstash anywhere
NO Judge0 anywhere
NO Anthropic anywhere
```

---

## Step 1.1 — Run the backend audit

The backend was generated from v2 spec which still had Redis and Judge0.
Use this audit prompt to clean it in one shot.

Open a **new Claude Code session**. Dump your entire backend codebase using PowerShell:

```powershell
Get-ChildItem -Recurse -Filter "*.py" | ForEach-Object {
    Write-Output "`n=== $($_.FullName.Replace($PWD.Path, '')) ==="
    Get-Content $_.FullName
} | Out-File backend_dump.txt

"=== requirements.txt ===" | Out-File -Append backend_dump.txt
Get-Content requirements.txt | Out-File -Append backend_dump.txt
"=== Dockerfile ===" | Out-File -Append backend_dump.txt
Get-Content Dockerfile | Out-File -Append backend_dump.txt
"=== .env.example ===" | Out-File -Append backend_dump.txt
Get-Content .env.example | Out-File -Append backend_dump.txt
```

Then paste this audit prompt followed by the contents of `backend_dump.txt`:

```
═══════════════════════════════════════════════════════════════
EXAMFORGE BACKEND — PRODUCTION AUDIT & CLEANUP
═══════════════════════════════════════════════════════════════
Current confirmed stack:
- FastAPI + Python 3.11
- Firebase Admin SDK (auth)
- Supabase (all DB + Storage)
- Piston API for code execution (POST https://emkc.org/api/v2/piston/execute)
- Gemini 1.5 Flash (google-generativeai package, GEMINI_API_KEY env var)
- Render deployment ($PORT auto-injected)
- slowapi rate limiting (in-memory MemoryLimiter — no Redis)
- NO Redis, NO Upstash, NO Judge0, NO Anthropic anywhere

AUDIT AND FIX ALL OF:

1. requirements.txt — Remove: anthropic, upstash-redis, redis
   Keep: fastapi, uvicorn, gunicorn, pydantic, pydantic-settings,
   firebase-admin, supabase, httpx, google-generativeai,
   python-dotenv, slowapi, structlog, python-multipart, alembic, asyncpg

2. config.py — Remove: REDIS_URL, REDIS_TOKEN, SIGNED_URL_CACHE_TTL_S,
   QUIZ_REDIS_TTL_S, JUDGE0_API_KEY, JUDGE0_BASE_URL, ANTHROPIC_API_KEY
   Keep: FIREBASE_CREDENTIALS_JSON, SUPABASE_URL, SUPABASE_SERVICE_KEY,
   SUPABASE_STORAGE_BUCKET, GEMINI_API_KEY, SIGNED_URL_EXPIRY_S

3. doubt_service.py — Must use google.generativeai:
   import google.generativeai as genai
   genai.configure(api_key=settings.GEMINI_API_KEY)
   model = genai.GenerativeModel("gemini-1.5-flash")
   response = model.generate_content(prompt_text)
   return response.text

4. judge_service.py — Must use Piston API:
   PISTON_URL = "https://emkc.org/api/v2/piston/execute"
   payload = {"language": lang, "version": "*",
              "files": [{"name": "main", "content": code}],
              "stdin": stdin, "args": []}
   result = (await httpx.AsyncClient().post(PISTON_URL, json=payload)).json()
   return {"stdout": result["run"]["stdout"],
           "stderr": result["run"]["stderr"],
           "exit_code": result["run"]["code"]}

5. quiz_service.py — All quiz state writes go to Supabase directly (UPSERT)
   No Redis calls anywhere

6. notes_service.py — Generate fresh signed URL every request
   No Redis caching of URLs

7. rate_limit.py / main.py — Use slowapi MemoryLimiter only
   Remove any Redis rate limit counter code

8. Dockerfile CMD — Use $PORT (Render injects it):
   CMD ["gunicorn", "main:app", "--worker-class", "uvicorn.workers.UvicornWorker",
        "--workers", "2", "--bind", "0.0.0.0:$PORT", "--timeout", "60",
        "--access-logfile", "-"]

9. .env.example — Must contain ONLY:
   APP_ENV=development
   DEBUG=false
   ALLOWED_ORIGINS=["http://localhost:5173"]
   FIREBASE_CREDENTIALS_JSON=/path/to/serviceAccount.json
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_STORAGE_BUCKET=notes-content
   GEMINI_API_KEY=your-gemini-key-from-aistudio
   SIGNED_URL_EXPIRY_S=3600

10. Verify these 5 API flows work correctly:
    GET /health → {"status": "ok"}
    GET /api/subjects → published subjects list
    GET /api/notes/{id}/url → {"signed_url": "..."} (no storage_path)
    POST /api/judge/submit → Piston response
    POST /api/doubts/ask → Gemini response

Output every changed file in full. End with AUDIT COMPLETE: YES/NO + blockers.
═══════════════════════════════════════════════════════════════

[PASTE backend_dump.txt CONTENTS HERE]
```

---

## Step 1.2 — Verify locally

```bash
cd examforge-backend
uvicorn main:app --reload --port 8000
```

Check `http://localhost:8000/docs` — Swagger UI with all endpoints visible.

```bash
curl http://localhost:8000/health
# → {"status": "ok"}
```

If it starts cleanly: Phase 1 done. ✅

---

---

# PHASE 2 — EXTRACT THE API CONTRACT

This step prevents the #1 cause of frontend/backend mismatches.
Takes 15 minutes, saves 10 hours of debugging.

---

## Step 2.1 — Generate the API contract

Open a **new Claude session**. Paste this:

```
═══════════════════════════════════════════════════════════════
EXAMFORGE — API CONTRACT EXTRACTION
═══════════════════════════════════════════════════════════════
I have a FastAPI backend for ExamForge. Below are all Pydantic
response models from my backend (app/models/*.py files).

Generate a single TypeScript file `examforge-api-contract.ts` containing:
1. A typed interface for every API response shape
2. A typed interface for every API request body
3. A const object API_ENDPOINTS mapping every endpoint name to its path

Required interfaces (verify all exist):
  SubjectResponse        → id, slug, name, icon, is_published, exam_weight_pct
  ChapterResponse        → id, title, slug, order_index, gate_weightage, subject_id
  TopicResponse          → id, name, slug, chapter_id
  QuestionResponse       → id, type, difficulty, marks, question_text,
                           option_a/b/c/d, correct_option, correct_options,
                           nat_answer_min, nat_answer_max, nat_unit,
                           explanation, gate_year, is_pyq, tags
  FlashcardResponse      → id, front, back, topic_id, next_review,
                           ease_factor, interval, repetitions
  NoteUrlResponse        → signed_url (ONLY — no storage_path ever)
  LeaderboardEntry       → user_id, display_name, total_points, weekly_points, rank
  QuizSessionResponse    → session_id, questions, current_index, time_left
  QuizSubmitResponse     → score, correct, wrong, unattempted, time_taken
  UserProgressResponse   → subjects with completion_pct, questions_attempted
  JudgeResponse          → stdout, stderr, exit_code
  DoubtResponse          → answer (string)
  BookmarkResponse       → id, chapter_id, chapter_title, created_at
  UserProfile            → uid, email, display_name, role, avatar_url, college

Output only the TypeScript file. No markdown. No explanation.
Start with: // ExamForge API Contract — Auto-generated from backend models

[PASTE app/models/*.py CONTENTS HERE]
═══════════════════════════════════════════════════════════════
```

Save output as `examforge-api-contract.ts` in your project root.

---

## Step 2.2 — Quick verify

Open `examforge-api-contract.ts` and confirm:
- `NoteUrlResponse` has ONLY `signed_url` — no `storage_path`
- `JudgeResponse` does NOT mention Judge0
- `DoubtResponse` does NOT mention Anthropic
- All interfaces from Step 2.1 list are present

If anything is missing: `"Add missing interface for [name]. Keep all other interfaces."`

---

---

# PHASE 3 — BUILD THE FRONTEND WITH STITCH DESIGN

## Critical — READ BEFORE STARTING

The frontend MUST use the **Stitch MCP server** for all design decisions.
The design system is **The Academic Atelier** ("The Digital Curator").
The v6 prompt enforces this. Do not use the old v5 prompt.

You have the Stitch HTML files in `stitch_ui_ux_design_project.zip`.
They contain the exact HTML for every page. The conversion strategy is:
**Copy Stitch HTML structure → Convert to JSX → Wire React logic**
Do NOT ask Claude to interpret the design. Give it the actual HTML.

---

## Step 3.1 — Scaffold the project

```bash
npm create vite@latest examforge -- --template react-ts
cd examforge
npm install
```

Install all dependencies:
```bash
npm install tailwindcss @tailwindcss/vite postcss autoprefixer
npm install zustand framer-motion recharts
npm install firebase @supabase/supabase-js
npm install dompurify @types/dompurify
npm install @monaco-editor/react
npm install react-draggable @types/react-draggable
npm install react-router-dom
npm install vite-plugin-pwa
npm install katex
```

Note: NO lucide-react. Icons are Material Symbols (Google Font, loaded in index.html).

---

## Step 3.2 — Connect Stitch MCP Server

Before generating any code:
1. Open Claude Code
2. Connect the Stitch MCP server to your project
3. Pull the ExamForge project from Stitch
4. Verify all design tokens are accessible

If Stitch MCP is not available, use the token values directly from
`examforge-frontend-prompt-v6.md` Section ❸ — they were extracted verbatim
from the Stitch project files.

---

## Step 3.3 — Generate the frontend

Open Claude Code with the Stitch MCP server connected.
Paste this prompt:

```
═══════════════════════════════════════════════════════════════
EXAMFORGE FRONTEND GENERATION v6
═══════════════════════════════════════════════════════════════

[PASTE ENTIRE examforge-frontend-prompt-v6.md HERE]

═══════════════════════════════════════════════════════════════
ADDITIONAL CONTEXT:

API Contract (already built backend):
[PASTE examforge-api-contract.ts HERE]

Backend URL: http://localhost:8000 (development)
Production: set via VITE_API_URL environment variable

Stitch HTML files available in: stitch_ui_ux_design_project/
  landing_page/code.html       → Landing.tsx source
  login/code.html              → Login.tsx source
  dashboard/code.html          → Dashboard.tsx source
  notes_viewer/code.html       → Notes.tsx source
  practice_tokyo_night/code.html → Practice.tsx source
  leaderboard_tokyo_night/code.html → Leaderboard.tsx source
  skills_tokyo_night/code.html → Skills.tsx source
  profile_settings_tokyo_night/code.html → Profile.tsx source

CONVERSION RULE: Copy HTML structure exactly. Change only:
  class= → className=
  for= → htmlFor=
  style="font-variation-settings: 'FILL' 1" → style={{ fontVariationSettings: "'FILL' 1" }}
  <form> → <div role="form">
  onclick= → onClick=
  Self-close void elements: <input />, <img />, <br />
  <a href="/route"> → <Link to="/route"> from react-router-dom

DO NOT change any Tailwind classes. DO NOT switch to lucide-react.
DO NOT change color values. DO NOT add new components not in the Stitch HTML.

Build in the order from Section ⓰ of the prompt.
Output each file with its full path as a header.
Do NOT skip. Do NOT summarize. Complete code only.
═══════════════════════════════════════════════════════════════
```

> Claude will hit output limits. Continue with:
> `"Continue from where you stopped. Last file completed: [filename]. Output complete code only."`

---

## Step 3.4 — Critical post-generation checks

After generation, manually verify these before running:

**`index.html`** — must have ALL of these in `<head>`:
```html
<!-- Google Fonts — exact from Stitch -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Fira+Code:wght@300..700&display=swap" rel="stylesheet"/>
<!-- Material Symbols — icons library -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<!-- KaTeX CSS — pre-rendered math in notes -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>
<!-- Theme flash prevention — MUST be before React bundle -->
<script>
  (function() {
    const t = localStorage.getItem('ef_theme') || 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  })();
</script>
```

**`tailwind.config.js`** — must have:
- `darkMode: "class"` (not `"media"`)
- All color tokens from Section 3B of v6 prompt wired to CSS variables
- All 6 fontFamily tokens: display, headline, body, label, notes, mono, serif, manuscript

**`src/index.css`** — must start with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
And must contain `.material-symbols-outlined` class definition.

**`src/lib/dompurify-config.ts`** — must export `DOMPURIFY_KATEX_CONFIG`.
Any notes component using DOMPurify must import this config.

---

## Step 3.5 — Test locally

```bash
npm run dev
```

Verify in order:
```
[ ] Landing page loads — matches Stitch landing_page/screen.png
[ ] Tokyo Night (dark) is default
[ ] Theme toggle switches correctly — html.dark class toggles
[ ] No console errors on load
[ ] Fonts load: hero uses Fraunces, body uses Inter
[ ] Material Symbols icons visible (not text strings)
[ ] Login page — left branding + right form layout
[ ] Buttons are pill-shaped (rounded-full = 0.75rem, not 9999px)
[ ] npm run build completes without TypeScript errors
```

---

---

# PHASE 4 — DEPLOY

---

## Step 4.1 — Deploy backend (Render — free tier)

1. Push `examforge-backend/` to GitHub
2. Render.com → New Web Service → Connect GitHub repo
3. Settings:
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:$PORT --timeout 60 --access-logfile -`
   - Instance type: Free
4. Add environment variables (from `.env`, one by one in Render dashboard):
   ```
   APP_ENV=production
   FIREBASE_CREDENTIALS_JSON=(paste entire JSON content)
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_STORAGE_BUCKET=notes-content
   GEMINI_API_KEY=your-key-from-aistudio
   SIGNED_URL_EXPIRY_S=3600
   ALLOWED_ORIGINS=["https://examforge.vercel.app","http://localhost:5173"]
   ```
5. Deploy. Backend URL: `https://examforge-backend.onrender.com`

Verify: `curl https://examforge-backend.onrender.com/health` → `{"status":"ok"}`

> Render free tier spins down after 15 min idle. Cold start ~30s. Fine for dev.

---

## Step 4.2 — Deploy frontend (Vercel — free)

Create `examforge/.env.production`:
```
VITE_API_URL=https://examforge-backend.onrender.com
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm install -g vercel
cd examforge
vercel
```

Set same env vars in Vercel dashboard → Project Settings → Environment Variables.

Frontend URL: `https://examforge.vercel.app`

---

## Step 4.3 — Update CORS on Render

In Render dashboard → Environment → update `ALLOWED_ORIGINS`:
```
["https://examforge.vercel.app","http://localhost:5173"]
```
Render auto-redeploys on env var changes.

---

---

# PHASE 5 — BIND EVERYTHING TO LIVE DATABASE

---

## Step 5.1 — Run SQL seeds against live Supabase

Get connection string: Supabase Dashboard → Project Settings → Database → URI

```powershell
# Windows PowerShell
$env:DATABASE_URL = "postgresql://postgres:[password]@[host]:5432/postgres"

cd examforge-backend/db/seeds

# Run all seeds in correct order
$subjects = @("algo","cd","cn","coa","cprog","dbms","dl","dm","dsa","em","ga","os","toc")
foreach ($subject in $subjects) {
    Write-Host "Seeding $subject..."
    psql $env:DATABASE_URL -f "${subject}-seed.sql"
    Get-ChildItem "${subject}-seed-p*.sql" | Sort-Object Name | ForEach-Object {
        psql $env:DATABASE_URL -f $_.Name
    }
    Write-Host "✅ $subject done"
}
```

Verify in Supabase SQL Editor:
```sql
SELECT s.slug, COUNT(q.id) as questions, COUNT(f.id) as flashcards
FROM subjects s
LEFT JOIN questions q ON q.subject_id = s.id
LEFT JOIN flashcards f ON f.subject_id = s.id
GROUP BY s.slug ORDER BY s.slug;
-- Every subject should show 100+ questions
```

---

## Step 5.2 — Create Storage bucket

Supabase Dashboard → Storage → New bucket:
- Name: `notes-content`
- Public: **NO** (private — backend generates signed URLs)

---

## Step 5.3 — Upload notes HTML files

Save as `upload_notes.py` in project root and run:

```python
from supabase import create_client
import os

sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
BUCKET = "notes-content"
NOTES_FOLDER = "Gate Cse notes"

UPLOAD_MAP = {
    "algo":  ["algo-01-complexity-sorting-searching.html",
              "algo-02-graph-algorithms.html",
              "algo-03-dp-greedy-divide-conquer.html"],
    "cd":    ["compiler-design-complete.html"],
    "cn":    ["cn-01-datalink-network-routing.html",
              "cn-02-transport-application-1.html"],
    "coa":   ["coa-01-number-systems-boolean-circuits.html",
              "coa-02-cpu-isa-pipeline-memory.html"],
    "cprog": ["c-programming-complete-1.html"],
    "dbms":  ["dbms-gate-notes-v2-1.html",
              "dbms-02-sql-relational-algebra-3.html",
              "dbms-03-transactions-concurrency-1.html",
              "dbms-04-er-indexing-relational-calculus.html"],
    "dm":    ["dm-01-logic-sets-relations-functions-2.html",
              "dm-02-graph-theory-combinatorics.html"],
    "dsa":   ["ds-01-linear-data-structures-2.html",
              "ds-02-trees-heaps.html"],
    "em":    ["em-01-calculus-linear-algebra-probability-2.html",
              "em-02-differential-equations-numerical-methods.html"],
    "ga":    ["aptitude-quantitative-master.html",
              "aptitude-verbal-master.html"],
    "os":    ["os-01-processes-scheduling-synchronization.html",
              "os-02-memory-filesystems-io.html"],
    "toc":   ["toc-01-automata-grammars.html",
              "toc-02-turing-decidability.html"],
}

for subject, files in UPLOAD_MAP.items():
    for filename in files:
        local_path = os.path.join(NOTES_FOLDER, filename)
        storage_path = f"notes/gate/{subject}/{filename}"
        if not os.path.exists(local_path):
            print(f"⚠️  MISSING: {local_path}")
            continue
        with open(local_path, "rb") as f:
            sb.storage.from_(BUCKET).upload(
                storage_path, f,
                file_options={"content-type": "text/html", "upsert": "true"}
            )
        print(f"✅ {storage_path}")

print("\nDone.")
```

```bash
SUPABASE_URL="https://xxx.supabase.co" \
SUPABASE_SERVICE_KEY="your-service-key" \
python upload_notes.py
```

---

## Step 5.4 — Insert notes table rows (binding SQL)

Open Supabase SQL Editor. Run the binding SQL from
`examforge-master-binding-prompt-v2.md` Section ❷ (Join Point 1).

Verify:
```sql
SELECT COUNT(*) FROM notes;  -- Expected: 25 rows
```

---

## Step 5.5 — Flip subjects live

```sql
UPDATE subjects SET is_published = true WHERE slug IN (
  'algo', 'cd', 'cn', 'coa', 'cprog',
  'dbms', 'dm', 'dsa', 'em', 'ga', 'os', 'toc'
);
-- dl stays false — no notes HTML yet
```

---

## Step 5.6 — Full end-to-end verification

```sql
-- Run in Supabase SQL Editor
SELECT s.slug, s.is_published,
       COUNT(DISTINCT q.id) AS questions,
       COUNT(DISTINCT f.id) AS flashcards,
       COUNT(DISTINCT n.id) AS notes_chapters
FROM subjects s
LEFT JOIN questions q ON q.subject_id = s.id
LEFT JOIN flashcards f ON f.subject_id = s.id
LEFT JOIN chapters c ON c.subject_id = s.id
LEFT JOIN notes n ON n.chapter_id = c.id
WHERE s.category = 'GATE'
GROUP BY s.slug, s.is_published
ORDER BY s.slug;
```

Manual browser checks:
```
[ ] https://examforge.vercel.app loads in dark mode (Tokyo Night)
[ ] Sign up with new account → Dashboard loads
[ ] DBMS → Chapter 1 → Notes load with paper aesthetic (cream bg, Lora)
[ ] Math equations render (KaTeX working)
[ ] Practice → DBMS → Questions load, timer works
[ ] Flashcards → DBMS → Flip animation works, SM-2 rating saves
[ ] Run Code in Skills → Piston executes, stdout shows
[ ] Ask AI in Notes → Gemini answer appears
[ ] DL subject → Notes → "Notes not ready yet" toast
[ ] Toggle theme → switches cleanly dark ↔ light
[ ] Turn off WiFi → reload → cached notes still load
[ ] Mobile view → bottom tab bar appears
```

---

---

# WHEN YOU GET STUCK

## Claude hit output limit mid-generation

```
Continue from where you stopped.
Last file completed: [filename]
Next file needed: [filename]
Output complete code only. Do NOT repeat previous files.
```

## Stitch design not applying correctly

```
The design from Stitch is not applying. Here is my current [filename]:
[paste file]

Here is the exact Stitch HTML for this page:
[paste from stitch_ui_ux_design_project/[page]/code.html]

Convert the Stitch HTML to JSX exactly as written.
Change ONLY: class→className, for→htmlFor, self-close void elements.
Do NOT change any Tailwind classes. Do NOT change any colors.
```

## Frontend and backend not connecting

```
ExamForge frontend is not connecting to backend correctly.
Frontend calls: [endpoint]
Backend returns: [what it returns]
Frontend expects: [what it needs]
API contract says: [paste interface from examforge-api-contract.ts]
Fix the mismatch. Show corrected code for both files.
```

## Starting a new Claude session

Always paste this context block first:
```
I am building ExamForge — GATE CSE prep platform.
Stack: FastAPI + Supabase + Firebase + Piston (code) + Gemini (AI) + Render + Vercel
NO Redis. NO Judge0. NO Anthropic.
Frontend: React 18 + Vite + Tailwind (html.dark) + Stitch design system
Design: The Academic Atelier — Material Symbols icons, Fraunces/Newsreader/Inter/Lora fonts

Files: frontend-v6.md · backend-v2.md (with overrides) · master-binding-v2.md
Currently at: PHASE [X], Step [X.X]
Backend [done/not done]. Frontend [done/not done].
Seeds [run/not run]. Notes [uploaded/not uploaded].

Current task: [describe it]
Do not reinvent. Work within the established system.
```

---

---

# ZERO-COST STACK — QUICK REFERENCE

| Service | Provider | Cost | Free limit |
|---|---|---|---|
| Auth | Firebase Auth | ✅ Free | Unlimited |
| Database | Supabase | ✅ Free | 500MB |
| Storage | Supabase Storage | ✅ Free | 1GB |
| AI Doubts | Gemini 1.5 Flash | ✅ Free | 1,500 req/day |
| Code Execution | Piston API | ✅ Free | No hard limit |
| Backend Deploy | Render | ✅ Free | Spins down 15min idle |
| Frontend Deploy | Vercel | ✅ Free | Unlimited |

**Where to get credentials:**
```
Firebase    → console.firebase.google.com → Project Settings → Service Accounts
Supabase    → supabase.com → Project Settings → API
Gemini Key  → aistudio.google.com → Get API Key
Render      → render.com → New Web Service
Vercel      → vercel.com → Import Git Repository
```

---

# QUICK REFERENCE

## All files and where they live

```
Your project root/
├── examforge-frontend-prompt-v6.md      ← USE THIS for frontend generation
├── examforge-backend-prompt-v2.md       ← Reference (use with Step 1.1 overrides)
├── examforge-pyq-universal-prompt-v2.md ← Reference only (seeds done)
├── examforge-master-binding-prompt-v2.md← Binding SQL reference
├── examforge-api-contract.ts            ← Generated in Phase 2
├── stitch_ui_ux_design_project.zip      ← Stitch HTML source files
├── upload_notes.py                      ← Notes upload script
│
├── examforge/                           ← Frontend (Phase 3)
│
├── examforge-backend/                   ← Backend (Phase 1 — built, needs audit)
│   └── db/seeds/                        ← 126 SQL files ✅
│
└── Gate Cse notes/                      ← 25 HTML notes files ✅
```

## Phases at a glance

| Phase | What | Status | Time |
|---|---|---|---|
| 1 | Audit + clean backend | ⚠️ Do this first | 1 hour |
| 2 | Extract API contract | ❌ Not done | 15 min |
| 3 | Build frontend (v6 + Stitch) | ❌ Not done | 3–4 hours |
| 4 | Deploy Render + Vercel | ❌ Not done | 1 hour |
| 5 | Bind DB + Storage | ❌ Not done | 1–2 hours |

## Universal slug table (NEVER change these)

| Subject | Slug | Notes Status |
|---|---|---|
| Algorithms | `algo` | ✅ 3 HTML files |
| Compiler Design | `cd` | ✅ 1 HTML file |
| Computer Networks | `cn` | ✅ 2 HTML files |
| COA | `coa` | ✅ 2 HTML files |
| C Programming | `cprog` | ✅ 1 HTML file |
| DBMS | `dbms` | ✅ 4 HTML files |
| Digital Logic | `dl` | ❌ No notes — stays unpublished |
| Discrete Math | `dm` | ✅ 2 HTML files |
| DSA | `dsa` | ⚠️ 2 HTML files (chapters 3–7 missing) |
| Engineering Math | `em` | ✅ 2 HTML files |
| General Aptitude | `ga` | ✅ 2 HTML files |
| Operating Systems | `os` | ✅ 2 HTML files |
| Theory of Computation | `toc` | ✅ 2 HTML files |

---

*ExamForge Execution Guide v3 · Aryan · April 2026*
*Stack: Firebase · Supabase · Piston · Gemini · Render · Vercel · NO Redis · NO Judge0*
*Design: Stitch MCP — The Academic Atelier — Material Symbols · Fraunces/Inter/Lora*
*Phases: Backend Audit → API Contract → Frontend (v6+Stitch) → Deploy → Bind*
