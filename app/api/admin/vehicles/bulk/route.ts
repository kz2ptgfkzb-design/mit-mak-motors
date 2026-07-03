import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { bulkSchema, zodMessage } from '@/lib/inventory/validation';
import { revalidateInventory } from '@/lib/inventory/revalidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });
  const { ids, action, status, value, price } = parsed.data;

  // Deletion needs the delete permission; everything else needs edit.
  const gate = await requirePermission(action === 'delete' ? 'vehicle:delete' : 'vehicle:edit');
  if (denied(gate)) return gate;

  const store = getStore();
  let updated = 0;

  for (const id of ids) {
    try {
      if (action === 'delete') {
        if (await store.deleteVehicle(id)) updated++;
      } else if (action === 'status' && status) {
        if (await store.updateVehicle(id, { status })) updated++;
      } else if (action === 'featured') {
        if (await store.updateVehicle(id, { featured: Boolean(value) })) updated++;
      } else if (action === 'homepage') {
        if (await store.updateVehicle(id, { showOnHomepage: Boolean(value) })) updated++;
      } else if (action === 'price' && typeof price === 'number') {
        if (await store.updateVehicle(id, { price })) updated++;
      }
    } catch (err) {
      console.error('[mit-mak] bulk op failed for', id, err);
    }
  }

  revalidateInventory();
  return NextResponse.json({ ok: true, updated });
}
