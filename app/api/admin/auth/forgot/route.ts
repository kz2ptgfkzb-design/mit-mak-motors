import { NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/auth/service';
import { sendEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`forgot:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ ok: true }); // silent throttle (no enumeration)
  }
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const email = typeof body?.email === 'string' ? body.email : '';
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

  const raw = await createPasswordResetToken(email);
  if (raw) {
    const base = process.env.APP_URL || new URL(req.url).origin;
    const resetUrl = `${base}/admin/reset-password?token=${raw}`;
    await sendEmail({
      to: email,
      subject: 'Reset your Mit-Mak Motors admin password',
      text: `We received a request to reset your Mit-Mak Motors admin password.\n\nReset it here (link expires in 1 hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    });
    console.log(`[mit-mak] Password reset link for ${email}: ${resetUrl}`);
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ ok: true, devResetUrl: resetUrl });
    }
  }
  // Always report success so the endpoint cannot be used to enumerate accounts.
  return NextResponse.json({ ok: true });
}
