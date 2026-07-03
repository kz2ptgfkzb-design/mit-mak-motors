import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { vehicleCreateSchema, zodMessage } from '@/lib/inventory/validation';
import { revalidateInventory } from '@/lib/inventory/revalidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requirePermission('vehicle:view');
  if (denied(gate)) return gate;
  const vehicles = await getStore().listVehicles();
  return NextResponse.json({ vehicles });
}

export async function POST(req: Request) {
  const gate = await requirePermission('vehicle:create');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = vehicleCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const vehicle = await getStore().createVehicle(parsed.data);
  revalidateInventory();
  return NextResponse.json({ vehicle }, { status: 201 });
}
