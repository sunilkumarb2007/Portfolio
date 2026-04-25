import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import { HttpError } from './error';

export interface AdminPayload {
  sub: string;
  role: 'admin';
}

export function signAdminToken(email: string): string {
  return jwt.sign({ sub: email, role: 'admin' } satisfies AdminPayload, env.JWT_SECRET, {
    expiresIn: '12h',
  });
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing bearer token');
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    if (payload.role !== 'admin') throw new HttpError(403, 'Forbidden');
    (req as unknown as { admin: AdminPayload }).admin = payload;
    next();
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, 'Invalid token');
  }
};
