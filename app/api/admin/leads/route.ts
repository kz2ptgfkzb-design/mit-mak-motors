import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requirePermission('lead:view');
  if (denied(gate)) return gate;
  const leads = await getStore().listLeads();
  return NextResponse.json({ leads });
}
