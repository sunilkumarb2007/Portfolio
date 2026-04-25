import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './env';
import { errorHandler, notFound } from './middleware/error';
import contactRouter from './routes/contact';
import analyticsRouter from './routes/analytics';
import adminRouter from './routes/admin';
import projectsRouter from './routes/projects';
import aiRouter from './routes/ai';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
      credentials: false,
    }),
  );
  app.use(express.json({ limit: '64kb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'portfolio-api', uptime: process.uptime() });
  });

  app.use('/api/contact', contactRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/ai', aiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
