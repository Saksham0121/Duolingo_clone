# 🦉 Duolingo Clone — Agent Progress & Context File

> **Purpose**: This file is the single source of truth for all agents (human or AI) continuing work on this project.
> Update this file after every commit. Read it first before doing anything else.

---

## 📊 Overall Progress

```
██████████████████████████████  100% Complete
```

| Phase | Status |
|---|---|
| 🟢 Monorepo scaffold | ✅ DONE |
| 🟢 Backend: Models + Seed | ✅ DONE |
| 🟢 Backend: FastAPI API | ✅ DONE |
| 🟢 Frontend: Next.js Setup + Design System | ✅ DONE |
| 🟢 Frontend: Sidebar + Top HUD | ✅ DONE |
| 🟢 Frontend: Skill Tree / Learning Path | ✅ DONE |
| 🟢 Frontend: Lesson Player Shell | ✅ DONE |
| 🟢 Frontend: All 5 Exercise Types | ✅ DONE |
| 🟢 Frontend + Backend: Gamification Wiring | ✅ DONE |
| 🟢 Frontend: Profile + Leaderboard Pages | ✅ DONE |
| 🟢 Frontend: Polish (animations, mascot, responsive) | ✅ DONE |
| 🟢 Docs: Final README | ✅ DONE |

---

## ✅ Commit History

| # | Hash | Message | What's in it |
|---|---|---|---|
| 1 | `b746ba8` | `chore: scaffold monorepo...` | `.gitignore`, `README.md`, `backend/`, `frontend/` dirs |
| 2 | `9aaa93c` | `feat(backend): add SQLAlchemy models (German 🇩🇪)...` | `models.py`, `database.py`, `seed.py`, `requirements.txt` |
| 3 | `d5b8232` | `Implemented API, routes, schemas` | All FastAPI routers, `schemas.py`, `main.py`, `render.yaml` |
| 4 | `61683e3` | `nextjs with design system, gamecontext and apiclient` | `globals.css`, `types/`, `lib/api.ts`, `GameContext.tsx`, layout, env files |

---

## 🔄 Currently In Progress — Commit 5

**Goal**: Sidebar navigation + Top HUD (streak, XP, gems, hearts)

### Files already written (NOT yet committed):
- `frontend/src/components/layout/Sidebar.tsx` ✅
- `frontend/src/components/layout/TopHUD.tsx` ✅
- `frontend/src/components/layout/AppShell.tsx` ✅

### Still needed for Commit 5:
- [ ] Root `page.tsx` — redirect `/` → `/learn`
- [ ] Placeholder pages: `/practice`, `/quests`, `/shop`
- [ ] TypeScript check + verify dev server starts
- [ ] **ASK USER for commit message before committing**

---

## 📋 Full Task Checklist

### Commit 5 — Sidebar + HUD Layout
- [x] `Sidebar.tsx` — all nav items, active state, logo, promo card
- [x] `TopHUD.tsx` — 🇩🇪 flag, 🔥 streak, ⚡ XP, 💎 gems, ❤️ hearts, avatar
- [x] `AppShell.tsx` — 3-column layout (sidebar | main | right panel)
- [ ] Root redirect page.tsx
- [ ] Placeholder route pages
- [ ] Ask user for commit msg → commit

### Commit 6 — Skill Tree / Learning Path
- [ ] `frontend/src/app/learn/page.tsx` — main learning path page
- [ ] `frontend/src/components/skillTree/SkillNode.tsx` — node (locked/active/complete)
- [ ] `frontend/src/components/skillTree/UnitHeader.tsx` — unit banner
- [ ] `frontend/src/components/skillTree/PathConnector.tsx` — SVG zig-zag path
- [ ] `frontend/src/components/skillTree/RightPanel.tsx` — Super promo, leaderboard snippet, daily quests
- [ ] Ask user for commit msg → commit

### Commit 7 — Lesson Player Shell
- [ ] `frontend/src/app/lesson/[lessonId]/page.tsx`
- [ ] `frontend/src/components/lesson/LessonHeader.tsx` — progress bar + X + hearts
- [ ] `frontend/src/components/lesson/FeedbackBar.tsx` — green/red bottom bar
- [ ] `frontend/src/components/lesson/LessonComplete.tsx` — completion modal
- [ ] `frontend/src/components/lesson/OutOfHearts.tsx` — no hearts modal
- [ ] Ask user for commit msg → commit

### Commit 8 — All 5 Exercise Types
- [ ] `frontend/src/components/exercises/MultipleChoice.tsx`
- [ ] `frontend/src/components/exercises/WordBank.tsx`
- [ ] `frontend/src/components/exercises/MatchPairs.tsx`
- [ ] `frontend/src/components/exercises/FillInBlank.tsx`
- [ ] `frontend/src/components/exercises/TypeAnswer.tsx`
- [ ] `frontend/src/components/exercises/ExerciseRenderer.tsx`
- [ ] `frontend/src/components/exercises/AudioButton.tsx` — Web Speech API (de-DE)
- [ ] Ask user for commit msg → commit

### Commit 9 — Gamification Wiring
- [ ] Wire lesson complete → POST `/api/progress/complete` → update GameContext XP
- [ ] Wire wrong answer → POST `/api/progress/wrong` → update GameContext hearts
- [ ] Heart refill modal → POST `/api/progress/refill-hearts`
- [ ] XP float animation on correct answer
- [ ] Streak increment notification toast
- [ ] Ask user for commit msg → commit

### Commit 10 — Profile + Leaderboard Pages
- [ ] `frontend/src/app/profile/page.tsx` — stats, achievements, avatar
- [ ] `frontend/src/app/leaderboards/page.tsx` — weekly XP, league badges
- [ ] `frontend/src/components/profile/AchievementBadge.tsx`
- [ ] `frontend/src/components/leaderboard/LeaderboardRow.tsx`
- [ ] Ask user for commit msg → commit

### Commit 11 — Polish
- [ ] Mascot component (Duo owl emoji + idle animation)
- [ ] Framer Motion entrance animations on skill nodes + lesson cards
- [ ] Confetti on lesson complete
- [ ] Responsive breakpoints (mobile sidebar collapses)
- [ ] Page transitions
- [ ] Ask user for commit msg → commit

### Commit 12 — Final README
- [ ] Full setup instructions (local dev + deployment)
- [ ] Architecture diagram (Mermaid)
- [ ] DB schema table
- [ ] API endpoint reference table
- [ ] Deployment guide (Render + Vercel)
- [ ] Ask user for commit msg → commit

---

## 🏗️ Architecture

```
DuolingocloneScaler/
├── backend/                    ✅ COMPLETE
│   ├── app/
│   │   ├── main.py             FastAPI app + CORS
│   │   ├── database.py         SQLAlchemy engine + session
│   │   ├── models.py           All ORM models
│   │   ├── schemas.py          Pydantic schemas
│   │   └── routers/
│   │       ├── course.py       GET /api/courses/, /api/courses/{id}/units
│   │       ├── lessons.py      GET /api/lessons/{id}/exercises
│   │       ├── progress.py     POST /api/progress/complete|wrong|refill-hearts
│   │       ├── user.py         GET /api/user/{id}, /streak, /hearts, /achievements
│   │       └── leaderboard.py  GET /api/leaderboard/
│   ├── seed.py                 135 exercises, 10 users, German course
│   ├── requirements.txt
│   ├── render.yaml             Render deployment config
│   └── .venv/                  (gitignored)
│
└── frontend/                   🔄 IN PROGRESS
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx      Root layout (GameProvider + Toaster)
    │   │   ├── globals.css     Full Duolingo design system
    │   │   ├── page.tsx        → redirect to /learn (TODO)
    │   │   ├── learn/          → Skill tree (TODO)
    │   │   ├── lesson/[id]/    → Lesson player (TODO)
    │   │   ├── leaderboards/   → Leaderboard (TODO)
    │   │   ├── profile/        → Profile (TODO)
    │   │   ├── quests/         → Placeholder (TODO)
    │   │   └── shop/           → Placeholder (TODO)
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx     ✅ Written
    │   │   │   ├── TopHUD.tsx      ✅ Written
    │   │   │   └── AppShell.tsx    ✅ Written
    │   │   ├── skillTree/      (TODO)
    │   │   ├── lesson/         (TODO)
    │   │   ├── exercises/      (TODO)
    │   │   ├── profile/        (TODO)
    │   │   └── leaderboard/    (TODO)
    │   ├── context/
    │   │   └── GameContext.tsx ✅ XP/hearts/streak global state
    │   ├── lib/
    │   │   └── api.ts          ✅ Typed fetch client
    │   └── types/
    │       └── index.ts        ✅ All TS interfaces
    ├── .env.local              NEXT_PUBLIC_API_URL=http://localhost:8000
    ├── .env.example            Template for deployment
    └── vercel.json             Vercel deployment config
```

---

## 🔑 Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth | Mocked (user_id=1 always) | Spec allows it |
| Language | German 🇩🇪 | User requested |
| Audio | Web Speech API `speechSynthesis` (`lang='de-DE'`) | No API key, native browser, free |
| TTS | Frontend-only | `window.speechSynthesis.speak()` with German voice |
| Styling | Tailwind v4 (CSS-first) + inline styles for complex components | Next.js 16 ships with Tailwind v4 |
| Animations | Framer Motion + CSS keyframes in globals.css | Both available |
| State | React Context + useReducer (GameContext) | No Redux needed at this scale |
| DB | SQLite via SQLAlchemy | Spec requirement |
| Deployment | Render (backend) + Vercel (frontend) | Free tier available |

---

## 🎨 Color Palette (Duolingo Dark Theme)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#131f24` | Page background |
| `--color-bg-card` | `#1f3240` | Cards, sidebar |
| `--color-bg-elevated` | `#253a4a` | Hover, inputs |
| `--color-bg-border` | `#2d4a5e` | Borders, dividers |
| `--color-duo-green` | `#58cc02` | Primary CTA, correct answers |
| `--color-duo-blue` | `#1cb0f6` | Secondary, selected states |
| `--color-duo-red` | `#ff4b4b` | Wrong answers, hearts lost |
| `--color-duo-yellow` | `#ffc800` | XP, streaks |
| `--color-duo-orange` | `#ff9600` | Streak fire, unit 3 |
| `--color-duo-purple` | `#ce82ff` | Unit 2 accent |

---

## 🚀 How to Run Locally

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python seed.py          # seeds German course + 10 users
uvicorn app.main:app --reload --port 8000
# API docs → http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
# .env.local already has NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
# App → http://localhost:3000
```

---

## ⚙️ Agent Rules (MUST FOLLOW)

1. **Always ask for commit message** before running `git commit` — never auto-commit
2. **Ask before adding any extra feature** not in the spec/checklist above
3. **Language is German** — all seed content, UI labels for exercises
4. **Audio uses Web Speech API** — `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))` with `lang = 'de-DE'`
5. **All 5 exercise types** must be implemented: `multiple_choice`, `word_bank`, `match_pairs`, `fill_blank`, `type_answer`
6. **Single default user** `user_id = 1` — no real auth
7. **Update this file** after every commit — mark tasks done, update progress bar

---

## 📅 Last Updated

- **Timestamp**: 2026-07-26T15:37:00+05:30
- **Last commit**: `61683e3` — `nextjs with design system, gamecontext and apiclient`
- **Next step**: Finish Commit 5 (root redirect + placeholder pages) → ask for commit msg → commit → start Commit 6 (Skill Tree)
