import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const featured = req.query.featured === 'true';
    const where = featured ? { featured: true } : {};
    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { year: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ items: projects });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

export default router;
