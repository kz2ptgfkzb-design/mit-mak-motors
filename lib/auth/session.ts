import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@/lib/inventory/types';

// Edge-safe session helpers (jose only — no node APIs, no store). Imported by
// both middleware (edge) and the server auth service (node).

export const SESSION_COOKIE = 'mm_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Dev fallback so the admin works with zero setup. MUST be overridden in
// production via AUTH_SECRET (see ADMIN_SETUP.md / production checklist).
const DEV_SECRET = 'mit-mak-dev-secret-change-me-in-production-0000000000';

export function authSecret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || DEV_SECRET;
}

export function usingDevSecret(): boolean {
  return !(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
}

/**
 * Fail closed: never sign/verify sessions with the committed dev secret when
 * real data is at stake (it would let anyone forge an admin cookie). This is
 * true only in production AND when a database is connected. A keyless, no-DB
 * demo (ephemeral file store) stays usable; the moment a database is wired, a
 * real AUTH_SECRET becomes mandatory or login is refused and sessions are void.
 */
export function secretMisconfigured(): boolean {
  if (!usingDevSecret() || process.env.NODE_ENV !== 'production') return false;
  const dbConfigured = Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING,
  );
  return dbConfigured;
}

function key(): Uint8Array {
  return new TextEncoder().encode(authSecret());
}

export interface SessionClaims {
  sub: string; // user id
  email: string;
  name: string;
  role: Role;
}

export async function createSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ email: claims.email, name: claims.name, role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  if (secretMisconfigured()) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (!payload.sub || !payload.role) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}
