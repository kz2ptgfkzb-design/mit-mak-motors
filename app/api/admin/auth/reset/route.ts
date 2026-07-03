import { NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/lib/auth/service';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
  }
  let body: { token?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const token = typeof body?.token === 'string' ? body.token : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!token) return NextResponse.json({ error: 'Reset token is missing.' }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  const ok = await resetPasswordWithToken(token, password);
  if (!ok) return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
