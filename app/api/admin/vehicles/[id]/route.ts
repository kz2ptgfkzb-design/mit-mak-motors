import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { vehiclePatchSchema, zodMessage } from '@/lib/inventory/validation';
import { revalidateInventory } from '@/lib/inventory/revalidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('vehicle:view');
  if (denied(gate)) return gate;
  const vehicle = await getStore().getVehicleById(params.id);
  if (!vehicle) return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
  return NextResponse.json({ vehicle });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('vehicle:edit');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = vehiclePatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const vehicle = await getStore().updateVehicle(params.id, parsed.data);
  if (!vehicle) return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
  revalidateInventory();
  return NextResponse.json({ vehicle });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('vehicle:delete');
  if (denied(gate)) return gate;
  const ok = await getStore().deleteVehicle(params.id);
  if (!ok) return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
  revalidateInventory();
  return NextResponse.json({ ok: true });
}
