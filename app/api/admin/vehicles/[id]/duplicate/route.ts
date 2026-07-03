import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { revalidateInventory } from '@/lib/inventory/revalidate';
import type { VehicleInput } from '@/lib/inventory/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('vehicle:create');
  if (denied(gate)) return gate;

  const existing = await getStore().getVehicleById(params.id);
  if (!existing) return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });

  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = existing;
  const input: VehicleInput = {
    ...rest,
    slug: `${existing.slug}-copy`,
    stockNumber: '',
    status: 'draft',
    featured: false,
    showOnHomepage: false,
    dateAdded: new Date().toISOString(),
    tagline: existing.tagline,
    fullDescription: `${existing.fullDescription}`,
  };
  const vehicle = await getStore().createVehicle(input);
  revalidateInventory();
  return NextResponse.json({ vehicle }, { status: 201 });
}
