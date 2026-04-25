import { createHash } from 'crypto';
import { env } from '../env';

/**
 * One-way hash an IP address with a server-side pepper so we can rate-limit
 * and deduplicate without storing PII.
 */
export function hashIp(ip: string | undefined | null): string | null {
  if (!ip) return null;
  return createHash('sha256').update(env.JWT_SECRET).update(ip).digest('hex').slice(0, 32);
}
