import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import crypto from 'node:crypto';
import { getStore } from '@/lib/inventory/store';
import { isDbConfigured } from '@/lib/db/client';
import { toSafeUser, type SafeUser } from '@/lib/inventory/types';
import { hashPassword, verifyPassword } from './password';
import {
  createSessionToken,
  verifySessionToken,
  sessionCookieOptions,
  secretMisconfigured,
  SESSION_COOKIE,
} from './session';

const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

// ── seed the first Super Admin (once per process) ─────────────

const globalForSeed = globalThis as unknown as { __mmAdminSeeded?: Promise<void> };

export function ensureSeedAdmin(): Promise<void> {
  if (!globalForSeed.__mmAdminSeeded) {
    globalForSeed.__mmAdminSeeded = (async () => {
      const store = getStore();
      if ((await store.countUsers()) > 0) return;
      // Never ship a known default password to a real (database-backed)
      // production deployment. If ADMIN_PASSWORD is unset there, generate a
      // random one (no usable default). The keyless, no-database demo keeps a
      // known default so it is loginable out of the box (ephemeral, no real data).
      const secureSeed = process.env.NODE_ENV === 'production' && isDbConfigured();
      const email = (process.env.ADMIN_EMAIL || 'admin@mitmakmotors.co.za').toLowerCase();
      const password =
        process.env.ADMIN_PASSWORD ||
        (secureSeed ? crypto.randomBytes(24).toString('base64url') : 'MitMak@Admin2026');
      const name = process.env.ADMIN_NAME || 'Mit-Mak Admin';
      if (!process.env.ADMIN_PASSWORD && secureSeed) {
        console.warn(
          `[mit-mak] No ADMIN_PASSWORD set. Seeded ${email} with a RANDOM password. Use "Forgot password" at /admin/login to set your own.`,
        );
      }
      try {
        await store.createUser({
          // Deterministic id so the keyless demo admin is the same across
          // ephemeral serverless instances (session stays valid as you navigate).
          id: secureSeed ? undefined : 'mmseed-super-admin',
          email,
          name,
          role: 'super_admin',
          passwordHash: await hashPassword(password),
          active: true,
        });
        console.log(`[mit-mak] Seeded Super Admin: ${email}`);
      } catch (err) {
        // Likely a concurrent seed hit the unique(email) constraint — safe to ignore.
        console.warn('[mit-mak] admin seed skipped:', (err as Error).message);
      }
    })().catch((err) => {
      globalForSeed.__mmAdminSeeded = undefined;
      throw err;
    });
  }
  return globalForSeed.__mmAdminSeeded;
}

// ── login / logout ────────────────────────────────────────────

export interface LoginResult {
  ok: boolean;
  user?: SafeUser;
  error?: string;
}

export async function login(emailRaw: string, password: string): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !password) return { ok: false, error: 'Email and password are required.' };

  if (secretMisconfigured()) {
    return { ok: false, error: 'Admin sign-in is disabled until AUTH_SECRET is configured. See ADMIN_SETUP.md.' };
  }

  await ensureSeedAdmin();
  const store = getStore();
  const user = await store.getUserByEmail(email);

  // Constant-ish work whether or not the user exists (avoid user enumeration).
  const hash = user?.passwordHash || '$2a$10$0000000000000000000000000000000000000000000000000000';
  const valid = await verifyPassword(password, hash);

  if (!user || !user.active || !valid) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  cookies().set(SESSION_COOKIE, token, sessionCookieOptions());
  await store.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
  return { ok: true, user: toSafeUser(user) };
}

export function logout(): void {
  cookies().set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
}

/**
 * The signed-in admin for the current request, re-validated against the store
 * so role changes / deactivation take effect immediately. Memoised per request.
 */
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifySessionToken(token);
  if (!claims) return null;
  try {
    const user = await getStore().getUserById(claims.sub);
    if (!user || !user.active) return null;
    return toSafeUser(user);
  } catch (err) {
    console.error('[mit-mak] getCurrentUser failed:', err);
    return null;
  }
});

// ── password reset ────────────────────────────────────────────

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/** Returns the raw token (for building the reset URL). Does not reveal whether the email exists. */
export async function createPasswordResetToken(emailRaw: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();
  await ensureSeedAdmin();
  const store = getStore();
  const user = await store.getUserByEmail(email);
  if (!user || !user.active) return null;
  const raw = crypto.randomBytes(32).toString('hex');
  await store.createResetToken(user.id, hashToken(raw), new Date(Date.now() + RESET_TTL_MS));
  return raw;
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string): Promise<boolean> {
  if (!rawToken || newPassword.length < 8) return false;
  const store = getStore();
  const userId = await store.consumeResetToken(hashToken(rawToken));
  if (!userId) return false;
  const updated = await store.updateUser(userId, { passwordHash: await hashPassword(newPassword) });
  return Boolean(updated);
}

export async function changePassword(userId: string, newPassword: string): Promise<boolean> {
  if (newPassword.length < 8) return false;
  const updated = await getStore().updateUser(userId, { passwordHash: await hashPassword(newPassword) });
  return Boolean(updated);
}
