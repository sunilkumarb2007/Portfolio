# Architecture

## Goals

1. **Premium feel** — 3D experience without compromising 60 FPS or first-load JS.
2. **Real backend** — every interactive feature persists to Postgres; nothing is faked client-side.
3. **Production posture** — strict TS, Zod boundaries, rate limiting, hashed IPs, JWT-protected admin, CI.

## Repo layout

This is an npm-workspaces monorepo with two deployable apps and one shared CI pipeline.

```
apps/web   →  Next.js 14 (App Router, RSC for layout/static, client comps for 3D + interactivity)
apps/api   →  Express 4 (long-running locally; serverless on Vercel via api/index.ts)
```

### Why npm workspaces and not Turborepo / pnpm?

- Zero new tooling for contributors.
- Vercel's monorepo support reads `package.json` workspaces natively.
- `npm run dev` parallelizes both apps via `npm-run-all`.

## Frontend rendering strategy

| Component               | Render mode                | Reason                                    |
| ----------------------- | -------------------------- | ----------------------------------------- |
| `app/layout.tsx`        | Server                     | Static shell with metadata                |
| `app/page.tsx`          | Server                     | Sections imported at the boundary         |
| `Hero` / 3D scenes      | Client (`'use client'`)    | Refs, useFrame, browser-only WebGL        |
| `app/admin/*`           | Client                     | Uses `localStorage` for the admin token   |
| `PageTracker`           | Client                     | Reads `usePathname`                       |

Every 3D scene file is loaded via `next/dynamic` with `ssr: false`, so the heavy three.js bundle is split into its own chunk and only fetched when the section becomes visible.

## 3D scene patterns

- `<Canvas dpr={[1, 1.75]} powerPreference="high-performance" />` — caps device pixel ratio so even 4K screens stay performant.
- Reusable primitives: `Float`, `Sparkles`, `Edges`, `RoundedBox`, `Text` from `@react-three/drei`.
- All scenes use `useFrame` for delta-based animation; nothing relies on `setInterval`.
- Camera-on-scroll is implemented in plain JS (no `ScrollControls` so the host page scroll continues to work normally).
- `prefers-reduced-motion` halts animation but keeps the scene rendered (no jarring blank states).

## API design

- `createApp()` factory returns a fully-wired Express app, used by both `src/server.ts` (long-running) and `api/index.ts` (Vercel function). Same code, two runtimes.
- Each request goes through: helmet → cors → json(limit:64kb) → morgan → router → notFound → errorHandler.
- Errors are normalized: `ZodError → 400 { details }`, `HttpError → status + message`, anything else → 500 with logged stack.
- Prisma is a single shared instance (cached on `globalThis` in dev).

## Auth model

- Single admin (set via `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`).
- Login → bcrypt verify → 12h HS256 JWT.
- `requireAdmin` middleware verifies and attaches `req.admin`.
- Tokens stored in `localStorage` on the client (admin page only) — fine for a single-admin tool. For a multi-tenant app you'd switch to httpOnly cookies + CSRF.

## Analytics

- Events posted via `navigator.sendBeacon` (zero blocking on navigation).
- Server stores `type, path, referrer, sessionId, metadata (jsonb), ipHash, userAgent, createdAt`.
- Daily rollup query is a `DATE_TRUNC` group by — fine up to ~50k events/day; swap for a materialized view if it grows.

## AI assistant

- The portfolio assistant is grounded by injecting featured project descriptions into the system prompt.
- Conversation persisted per `sessionId` (every visit gets a session UUID via `sessionStorage`).
- Recommendations endpoint is **deliberately not LLM-backed** — keyword/tag overlap scoring is deterministic, free, and good enough.
- AI endpoints are rate-limited and return `503` when no API key is configured (the UI degrades gracefully).
