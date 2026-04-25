# Portfolio 3D — production-grade 3D portfolio platform

A next-generation portfolio for a senior full-stack engineer. Not a template — a small, real product.

- **Frontend**: Next.js 14 (App Router), TypeScript strict, Tailwind, Framer Motion, React Three Fiber, Three.js
- **Backend**: Node.js + Express, Prisma, PostgreSQL (Supabase in prod), Zod, JWT, helmet, rate-limited
- **AI**: OpenAI-backed in-portfolio assistant grounded on your projects + smart project recommendations
- **Analytics**: Lightweight first-party event tracking with hashed IPs (no cookies, no third-party pixels)
- **Admin panel**: Login, message inbox, analytics summary
- **DevOps**: Docker (compose for full local stack), GitHub Actions CI, Vercel deploy for both apps

## 1. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                              Browser                                 │
│   Next.js (R3F 3D scenes, sections, AI dock, admin UI)               │
└───────────────────────┬──────────────────────────────────────────────┘
                        │ HTTPS  (NEXT_PUBLIC_API_URL)
┌───────────────────────▼──────────────────────────────────────────────┐
│  Express API on Vercel (apps/api/api/index.ts wraps src/app.ts)      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ /api/contact      Zod validation, rate-limited, honeypot     │    │
│  │ /api/analytics    Fire-and-forget event ingestion            │    │
│  │ /api/projects     Public read (used by Projects section)     │    │
│  │ /api/ai/chat      OpenAI-backed, project-grounded            │    │
│  │ /api/ai/recs      Local scoring (no LLM cost) for hints      │    │
│  │ /api/admin/*      JWT-protected: messages + analytics        │    │
│  └──────────────────────────────────────────────────────────────┘    │
└───────────────────────┬──────────────────────────────────────────────┘
                        │ Prisma
┌───────────────────────▼──────────────────────────────────────────────┐
│  PostgreSQL (Supabase)                                               │
│  ContactMessage · AnalyticsEvent · Project · AiConversation/Message  │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. Tech stack

| Layer       | Choice                                                |
| ----------- | ----------------------------------------------------- |
| Frontend    | Next.js 14, TypeScript 5, Tailwind, Framer Motion     |
| 3D          | React Three Fiber, drei, three                        |
| State       | Zustand (per-need), local component state             |
| API         | Node.js 20, Express 4, Zod, helmet, express-rate-limit|
| ORM         | Prisma 5                                              |
| DB          | PostgreSQL 16 (Supabase prod, local Docker dev)       |
| Auth        | bcryptjs + JWT (HS256), 12h tokens                    |
| AI          | OpenAI (default `gpt-4o-mini`)                        |
| Logging     | pino                                                  |
| CI          | GitHub Actions (lint, typecheck, build, docker)       |
| Hosting     | Vercel (web + api as two projects)                    |

## 3. Folder structure

```
.
├── apps/
│   ├── web/                Next.js app (App Router)
│   │   ├── src/app         routes (/, /admin, /admin/login)
│   │   ├── src/components  layout · sections · 3d · ai · ui · analytics
│   │   ├── src/content     profile, experience, skills, projects (fallback)
│   │   ├── src/lib         api client, analytics, env, cn helper
│   │   ├── src/types       shared TS types
│   │   ├── tailwind.config.ts
│   │   ├── next.config.mjs
│   │   ├── Dockerfile
│   │   └── vercel.json
│   └── api/                Express API (also runs on Vercel as a serverless function)
│       ├── src             app, server, env, db, middleware, routes/*, utils
│       ├── prisma          schema.prisma + seed.ts
│       ├── api/index.ts    Vercel serverless adapter (exports the Express app)
│       ├── Dockerfile
│       └── vercel.json
├── docker-compose.yml      Full local stack: db + api + web
├── .github/workflows/ci.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOY.md
│   └── PERFORMANCE.md
└── README.md
```

## 4. Local development

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- Docker (optional, for the bundled Postgres)

### One-command stack via Docker

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up --build
```

Then open http://localhost:3000.

### Without Docker

```bash
# Postgres via docker (or use any local Postgres / Supabase URL)
docker run --name pf-pg -e POSTGRES_PASSWORD=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres:16-alpine

# Install
npm install

# Configure env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# DB
npm --workspace apps/api run prisma:migrate
npm --workspace apps/api run seed

# Dev (api on :4000, web on :3000)
npm run dev
```

## 5. Database schema

See `apps/api/prisma/schema.prisma`. Highlights:

- **ContactMessage** — `id, name, email, subject, message, ipHash, userAgent, read, createdAt`
- **AnalyticsEvent** — `id, type, path, referrer, sessionId, metadata (json), ipHash, userAgent, createdAt`
- **Project** — `id, slug, title, tagline, description, tags[], category, year, featured, liveUrl, repoUrl, cover`
- **AiConversation / AiMessage** — chat history persisted server-side per `sessionId`

IP addresses are never stored raw — only a peppered SHA-256 prefix for rate-limiting/dedup.

## 6. API routes

| Method | Path                              | Auth   | Notes                                      |
| ------ | --------------------------------- | ------ | ------------------------------------------ |
| GET    | `/api/health`                     | —      | Health probe                               |
| POST   | `/api/contact`                    | —      | Zod validated, rate-limited, honeypot      |
| POST   | `/api/analytics/event`            | —      | Fire-and-forget ingestion                  |
| GET    | `/api/projects`                   | —      | Public list (`?featured=true` filter)      |
| GET    | `/api/projects/:slug`             | —      | Single project                             |
| POST   | `/api/ai/chat`                    | —      | OpenAI proxy, grounded on featured projects|
| POST   | `/api/ai/recommendations`         | —      | Local interest-based scoring               |
| POST   | `/api/admin/login`                | —      | bcrypt + JWT (12h)                         |
| GET    | `/api/admin/messages`             | admin  | Cursor pagination                          |
| POST   | `/api/admin/messages/:id/read`    | admin  | Mark as read                               |
| GET    | `/api/admin/analytics/summary`    | admin  | 30-day rollup                              |

See `docs/API.md` for full request/response shapes.

## 7. Performance

- 3D canvases lazy-loaded with `next/dynamic` + `ssr: false`
- `Suspense` boundaries around each 3D scene
- DPR clamped at `[1, 1.75]` and `powerPreference: 'high-performance'`
- `prefers-reduced-motion` respected — 3D scenes still mount but stop animating
- `next` image optimization on; avif/webp formats prioritized
- Static-rendered pages where possible (`/`, `/admin/login`)
- `optimizePackageImports` enabled for `framer-motion`, `@react-three/drei`, `three`
- Per-route code splitting; admin chunks load only inside `/admin/*`
- API: rate limits on `/api/contact` and `/api/ai/*`; gzip/br via Vercel edge

## 8. Security

- Strict TypeScript, Zod validation on every endpoint that accepts input
- Helmet, CORS allowlist (`CORS_ORIGIN` env, supports comma-separated list)
- Rate limiting via `express-rate-limit` (separate buckets for contact / AI / admin login)
- Honeypot field on the contact form
- IPs hashed with a peppered SHA-256 — never stored in plaintext
- JWT secret enforced via Zod (min 16 chars); admin password stored only as a bcrypt(12) hash
- Security headers (`X-Frame-Options`, `Permissions-Policy`, `Referrer-Policy`, etc.) at both Next and Vercel layers
- No secrets in client bundles — only `NEXT_PUBLIC_*` env vars are exposed

## 9. Deployment

See `docs/DEPLOY.md` for the full step-by-step. Quick path:

1. Push to GitHub.
2. Provision a Postgres (e.g. Supabase). Save the `DATABASE_URL`.
3. Run `prisma migrate deploy` and `npm --workspace apps/api run seed`.
4. Create two Vercel projects from the same repo:
   - **api** — root: `apps/api`, framework: "Other", build command: `npm run vercel-build`
   - **web** — root: `apps/web`, framework: "Next.js"
5. Set env vars on each project (see `.env.example` files).
6. Set `NEXT_PUBLIC_API_URL` on `web` to the deployed `api` URL.
7. Redeploy.

## 10. License

MIT. Replace the content under `apps/web/src/content/` with your own bio / projects / skills.
