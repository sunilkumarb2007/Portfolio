import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { contactLimiter } from '../middleware/rateLimit';
import { hashIp } from '../utils/hash';
import { logger } from '../logger';

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
  // Honeypot field - should always be empty for real users
  website: z.string().max(0).optional(),
});

router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const body = ContactSchema.parse(req.body);
    if (body.website) {
      // honeypot tripped
      res.status(204).end();
      return;
    }
    const created = await prisma.contactMessage.create({
      data: {
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        subject: body.subject?.trim() || null,
        message: body.message.trim(),
        ipHash: hashIp(req.ip),
        userAgent: req.get('user-agent')?.slice(0, 500) ?? null,
      },
      select: { id: true, createdAt: true },
    });
    logger.info({ id: created.id }, 'contact_message_received');
    res.status(201).json({ ok: true, id: created.id });
  } catch (err) {
    next(err);
  }
});

export default router;
