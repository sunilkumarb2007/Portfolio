/**
 * Vercel serverless entry point. Wraps the Express app so the same code
 * runs both in `apps/api/src/server.ts` (long-running Node) and on Vercel
 * (per-request invocation).
 */
import { createApp } from '../src/app';

const app = createApp();

export default app;
