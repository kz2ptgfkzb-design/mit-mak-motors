import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { leadPatchSchema, zodMessage } from '@/lib/inventory/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('lead:edit');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = leadPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const patch = parsed.data.addNote
    ? { status: parsed.data.status, addNote: { author: gate.name || gate.email, body: parsed.data.addNote.body } }
    : { status: parsed.data.status };

  const lead = await getStore().updateLead(params.id, patch);
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('lead:delete');
  if (denied(gate)) return gate;
  const ok = await getStore().deleteLead(params.id);
  if (!ok) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
