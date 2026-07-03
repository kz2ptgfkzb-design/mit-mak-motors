import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { settingsSchema, zodMessage } from '@/lib/inventory/validation';
import { revalidateInventory } from '@/lib/inventory/revalidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requirePermission('settings:manage');
  if (denied(gate)) return gate;
  const settings = await getStore().getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const gate = await requirePermission('settings:manage');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const settings = await getStore().updateSettings(parsed.data);
  // hideSoldVehicles affects the public site.
  revalidateInventory();
  return NextResponse.json({ settings });
}
