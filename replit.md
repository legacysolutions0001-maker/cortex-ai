# CORTEX AI — Digital Brain OS X

A futuristic AI-powered operating platform that behaves like a digital human brain — remembering actions, analyzing behavior, predicting intentions, and visualizing intelligence through a cinematic holographic interface.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/cortex-ai run dev` — run the frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, Orbitron font
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas
- `lib/db/src/schema/` — Drizzle ORM table definitions (chat, memory, activity, tasks, notes, insights, notifications, commands)
- `artifacts/api-server/src/routes/` — Express route handlers (one file per module)
- `artifacts/cortex-ai/src/pages/` — Frontend pages (dashboard, assistant, memory, analytics, tasks, notes, system, commands, insights, notifications)
- `artifacts/cortex-ai/src/components/` — Shared components (NeuralBackground, BootSequence, Layout)

## Architecture decisions

- Contract-first: OpenAPI spec → codegen → typed hooks + Zod schemas used throughout
- Boot sequence plays on first load then transitions to the main app (stored in localStorage to prevent replay)
- System stats endpoint uses Node.js `os` module for real CPU/RAM data with simulated values for disk/battery/temperature
- Analytics summary aggregates across all tables at query time (no materialized view needed at this scale)
- Heatmap falls back to realistic synthetic data if fewer than 10 activity logs exist (ensures app feels alive on first load)

## Product

CORTEX AI is a full-featured AI command center with 10 modules:
- **Neural Dashboard** — live system vitals, core activity feed, active tasks
- **AI Assistant** — chat interface with typing effects and AI responses
- **Memory Engine** — stored behavioral patterns and command history with importance scores
- **Analytics** — productivity score, weekly activity charts, activity heatmap
- **Task Intelligence** — priority-coded task manager with CRUD
- **Knowledge Base** — futuristic note-taking with tags
- **System Monitor** — animated SVG ring gauges for CPU/RAM/disk/temperature, polling every 3s
- **Command Terminal** — holographic terminal with command history and execution
- **AI Insights** — AI-generated behavioral predictions with confidence scores
- **Notifications** — type-colored alert feed with read/unread states

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always re-run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`
- SVG `<path d="...">` must use numeric coordinates, not percentage strings (browser rejects them)
- System stats endpoint uses simulated values for some metrics (disk, battery, temp) — Node.js `os` doesn't expose these directly
- The `glow-success` CSS class is defined in `index.css` but only works if that class is explicitly added

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
