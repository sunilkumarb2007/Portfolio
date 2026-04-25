import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { env } from '../env';
import { aiLimiter } from '../middleware/rateLimit';
import { HttpError } from '../middleware/error';
import { prisma } from '../db';
import { logger } from '../logger';

const router = Router();

function getClient(): OpenAI {
  if (env.AI_DISABLED) throw new HttpError(503, 'AI features disabled');
  if (!env.OPENAI_API_KEY) throw new HttpError(503, 'AI not configured');
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

const ChatSchema = z.object({
  sessionId: z.string().max(64).optional(),
  conversationId: z.string().max(64).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are the in-portfolio AI assistant for Sunil Kumar B, an engineering
student at Panimalar Engineering College (Chennai) who builds full-stack web apps and learns
cloud / AI / systems on the side. Answer concisely (3-6 sentences) and only about Sunil's
projects, skills, experience, education, or how to get in touch. If asked something off-topic,
gently steer back. Use the projects context provided to ground answers. Never invent projects,
companies, or claims that are not in the context. Be honest about Sunil's level — early-career,
learning fast, internship-ready.`;

async function buildProjectContext(): Promise<string> {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ year: 'desc' }],
    take: 8,
  });
  if (projects.length === 0) return 'No projects available.';
  return projects
    .map(
      (p) =>
        `- ${p.title} (${p.year}, ${p.category}): ${p.tagline}. Tags: ${p.tags.join(', ')}. ${p.description}`,
    )
    .join('\n');
}

router.post('/chat', aiLimiter, async (req, res, next) => {
  try {
    const body = ChatSchema.parse(req.body);
    const client = getClient();

    const projectContext = await buildProjectContext();
    const systemMessage = `${SYSTEM_PROMPT}\n\nProjects:\n${projectContext}`;

    let conversationId = body.conversationId;
    if (!conversationId) {
      const conv = await prisma.aiConversation.create({
        data: { sessionId: body.sessionId },
      });
      conversationId = conv.id;
    }

    const lastUser = body.messages[body.messages.length - 1];
    if (lastUser?.role === 'user') {
      await prisma.aiMessage.create({
        data: { conversationId, role: 'user', content: lastUser.content },
      });
    }

    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemMessage },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? '';
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: reply,
        tokens: completion.usage?.total_tokens ?? null,
      },
    });

    res.json({ conversationId, reply });
  } catch (err) {
    if (err instanceof HttpError) return next(err);
    logger.error({ err }, 'ai_chat_failed');
    next(err);
  }
});

const RecommendSchema = z.object({
  interests: z.array(z.string().min(1).max(80)).min(1).max(10),
  limit: z.number().int().min(1).max(6).default(3),
});

router.post('/recommendations', aiLimiter, async (req, res, next) => {
  try {
    const body = RecommendSchema.parse(req.body);
    const all = await prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { year: 'desc' }] });

    // Local scoring: tag/keyword overlap. Cheap, deterministic, no LLM cost.
    const interests = body.interests.map((i) => i.toLowerCase());
    const scored = all
      .map((p) => {
        const haystack = [
          p.title,
          p.tagline,
          p.description,
          p.category,
          ...p.tags,
        ]
          .join(' ')
          .toLowerCase();
        const score = interests.reduce(
          (acc, q) => acc + (haystack.includes(q) ? 1 : 0),
          0,
        );
        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score || (a.project.featured === b.project.featured ? 0 : a.project.featured ? -1 : 1))
      .slice(0, body.limit);

    res.json({
      items: scored.map(({ project, score }) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        tagline: project.tagline,
        tags: project.tags,
        score,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
