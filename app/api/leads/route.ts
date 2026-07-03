import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { leadCreateSchema, zodMessage } from '@/lib/inventory/validation';
import { notifyNewLead } from '@/lib/inventory/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public enquiry endpoint used by vehicle detail pages and enquiry forms.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Silently accept without storing.
  if (typeof body._hp === 'string' && body._hp.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  try {
    const lead = await getStore().createLead(parsed.data);
    await notifyNewLead(lead);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[mit-mak] lead create failed:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again or call us.' }, { status: 500 });
  }
}
