import { NextResponse } from 'next/server';

/**
 * Shared form handler for the placeholder API routes.
 * If FORM_WEBHOOK_URL is set, the payload is forwarded there (wire this to your
 * CRM / email service / Zapier). Otherwise it's logged server-side and echoed
 * back as success — enough to develop and demo the full UX end-to-end.
 */
export async function handleFormSubmission(req: Request, kind: string) {
  let payload: unknown = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const webhook = process.env.FORM_WEBHOOK_URL;
  const record = { kind, receivedAt: new Date().toISOString(), payload };

  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error(`[mit-mak] webhook forward failed for ${kind}:`, err);
    }
  } else {
    console.log(`[mit-mak] ${kind} submission received:`, JSON.stringify(payload).slice(0, 800));
  }

  return NextResponse.json({ ok: true, kind });
}
