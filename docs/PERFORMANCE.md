# Performance notes

## First-load budget

`/` ships ~163 KB First Load JS (gzipped, before three.js chunks). 3D bundles are split out and lazy-loaded:

| Chunk             | When loaded                            |
| ----------------- | -------------------------------------- |
| Hero canvas       | Above the fold, on `next/dynamic`      |
| Skills orbit      | Lazy on intersection (`Suspense`)      |
| Projects gallery  | Lazy on intersection (`Suspense`)      |
| AI dock           | On the home page; minimal until opened |

## Runtime

- DPR clamped: `[1, 1.75]`. Most retina displays render at 1.5x; ultra-high DPR is a perf trap.
- Per-frame work is delta-based. We never call `setInterval` for animation.
- All particles are GPU-instanced via `Sparkles`. We don't allocate JS arrays per frame.
- Hover state lerps using `delta * factor` so hover is framerate-independent.
- `frameloop="always"` on Hero (because the camera follows the cursor); other scenes could switch to `"demand"` if needed.

## Network

- The API client uses `cache: 'no-store'` for live data, but Vercel can layer in cached `s-maxage` headers per route if you add `/api/projects` caching.
- Analytics requests use `navigator.sendBeacon` so they never block navigation.
- `next/font` self-hosts Inter, JetBrains Mono, and Space Grotesk. Zero external font requests.
- Images are configured for AVIF/WebP via `next/image` (used wherever you wire in real cover art).

## Lighthouse

A green Lighthouse score (>90 across all categories) is achievable with:

- Production build (`next build && next start`, not dev mode)
- Real production env (no source maps served)
- 3D canvases stay around 60 FPS on a Macbook Air M1 / Pixel 7

## What you'd add next

- `next/image` cover images per project (currently text-only cards)
- Edge caching on `/api/projects` (1 minute s-maxage is fine)
- Service worker / `next-pwa` for offline shell
- Replace the `useFrame` mouse-driven hero with `lerp + targetTo` and `frameloop="demand"` to drop GPU usage on idle
