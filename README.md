# TIMEMACHINE AI – Frontend

Vite + React client that powers the TIMEMACHINE AI experience. This folder is now the canonical frontend repository.

## Prerequisites
- Node.js 20+
- npm 10+

## Quickstart
```bash
cd frontend
npm install
cp .env.example .env
# set VITE_GEMINI_API_KEY (and optionally VITE_GEMINI_MODEL)
npm run dev
```

The dev server runs on http://localhost:3000 by default.

| Env var | Description |
| --- | --- |
| `VITE_GEMINI_API_KEY` | Required; API key used by `@google/genai` |
| `VITE_GEMINI_MODEL` | Optional; defaults to `gemini-2.5-flash` |

## Available Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |

## Working With The Backend
- Update service URLs or add API calls in `src/services/`.
- `.env` can store additional `VITE_*` variables to point to the FastAPI backend (e.g., `VITE_API_BASE_URL=http://localhost:8000/api`).

## Project Structure
```
src/
├── App.tsx              # Screen state machine & root layout
├── components/          # Shared UI (icons, buttons, etc.)
├── screens/             # Auth, Home, Diary, Simulation, Report views
├── services/            # Gemini integrations
├── types.ts             # Shared enums/interfaces
└── main.tsx             # Vite entry point
```

Static assets and metadata live under `public/`. Update `index.html` for TailwindCDN or other global resources.
