import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { seedVehicles } from '@/lib/inventory/seed';
import { revalidateInventory } from '@/lib/inventory/revalidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Refresh the live inventory to match the current scraped source site. Replaces
// all scrape-origin vehicles with the bundled seed; hand-added vehicles are kept.
export async function POST() {
  const gate = await requirePermission('vehicle:delete');
  if (denied(gate)) return gate;

  try {
    const result = await getStore().resyncScrapedInventory(seedVehicles());
    revalidateInventory();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[mit-mak] resync failed:', err);
    return NextResponse.json({ error: 'Resync failed.' }, { status: 500 });
  }
}
