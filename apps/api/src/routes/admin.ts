import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db';
import { env } from '../env';
import { requireAdmin, signAdminToken } from '../middleware/auth';
import { adminLoginLimiter } from '../middleware/rateLimit';
import { HttpError } from '../middleware/error';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

router.post('/login', adminLoginLimiter, async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    if (email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
      throw new HttpError(401, 'Invalid credentials');
    }
    if (!env.ADMIN_PASSWORD_HASH) {
      throw new HttpError(503, 'Admin password not configured');
    }
    const ok = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
    if (!ok) throw new HttpError(401, 'Invalid credentials');
    const token = signAdminToken(env.ADMIN_EMAIL);
    res.json({ token, expiresIn: 12 * 60 * 60 });
  } catch (err) {
    next(err);
  }
});

router.get('/messages', requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const messages = await prisma.contactMessage.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });
    const hasMore = messages.length > limit;
    res.json({
      items: messages.slice(0, limit),
      nextCursor: hasMore ? messages[limit - 1]?.id : null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/messages/:id/read', requireAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/summary', requireAdmin, async (_req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [total, byType, byDay] = await Promise.all([
      prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.analyticsEvent.groupBy({
        by: ['type'],
        _count: { _all: true },
        where: { createdAt: { gte: since } },
      }),
      prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
        SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*)::bigint AS count
        FROM "AnalyticsEvent"
        WHERE "createdAt" >= ${since}
        GROUP BY day
        ORDER BY day ASC
      `,
    ]);
    res.json({
      windowDays: 30,
      total,
      byType: byType.map((b) => ({ type: b.type, count: b._count._all })),
      byDay: byDay.map((d) => ({ day: d.day, count: Number(d.count) })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
