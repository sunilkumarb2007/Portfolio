import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db';
import { hashIp } from '../utils/hash';

const router = Router();

const EventSchema = z.object({
  type: z.string().min(1).max(64),
  path: z.string().max(512).optional(),
  referrer: z.string().max(512).optional(),
  sessionId: z.string().max(64).optional(),
  metadata: z.record(z.unknown()).optional(),
});

router.post('/event', async (req, res, next) => {
  try {
    const body = EventSchema.parse(req.body);
    await prisma.analyticsEvent.create({
      data: {
        type: body.type,
        path: body.path,
        referrer: body.referrer,
        sessionId: body.sessionId,
        metadata: body.metadata ? (body.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
        ipHash: hashIp(req.ip),
        userAgent: req.get('user-agent')?.slice(0, 500) ?? null,
      },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
