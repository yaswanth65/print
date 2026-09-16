import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'crypto';

export const SESSION_COOKIE = 'varma_xerox_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const SECRET = process.env.SESSION_SECRET || 'varma-xerox-dev-secret-change-me';

export interface SessionPayload {
  id: string;
  name: string;
  role: string;
  system: string;
  exp: number;
}

export function signSession(payload: Omit<SessionPayload, 'exp'>): {
  token: string;
  exp: number;
} {
  const exp = Date.now() + SESSION_TTL_MS;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
  return { token: `${body}.${sig}`, exp };
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const expected = createHmac('sha256', SECRET).update(body).digest();
  const provided = Buffer.from(sig, 'base64url');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
    if (!payload.id || !payload.name) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const candidate = scryptSync(pin, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}