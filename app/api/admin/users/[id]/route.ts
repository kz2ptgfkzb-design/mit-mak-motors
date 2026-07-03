import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { userPatchSchema, zodMessage } from '@/lib/inventory/validation';
import { hashPassword } from '@/lib/auth/password';
import { toSafeUser, type AdminUser } from '@/lib/inventory/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLastActiveSuperAdmin(users: AdminUser[], target: AdminUser): boolean {
  if (target.role !== 'super_admin' || !target.active) return false;
  return users.filter((u) => u.role === 'super_admin' && u.active).length <= 1;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('user:manage');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = userPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const store = getStore();
  const users = await store.listUsers();
  const target = users.find((u) => u.id === params.id);
  if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const demoting = parsed.data.role !== undefined && parsed.data.role !== 'super_admin';
  const deactivating = parsed.data.active === false;
  if ((demoting || deactivating) && isLastActiveSuperAdmin(users, target)) {
    return NextResponse.json({ error: 'You cannot remove the last active Super Admin.' }, { status: 400 });
  }

  const updated = await store.updateUser(params.id, {
    name: parsed.data.name,
    role: parsed.data.role,
    active: parsed.data.active,
    passwordHash: parsed.data.password ? await hashPassword(parsed.data.password) : undefined,
  });
  if (!updated) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  return NextResponse.json({ user: toSafeUser(updated) });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requirePermission('user:manage');
  if (denied(gate)) return gate;

  if (params.id === gate.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  const store = getStore();
  const users = await store.listUsers();
  const target = users.find((u) => u.id === params.id);
  if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  if (isLastActiveSuperAdmin(users, target)) {
    return NextResponse.json({ error: 'You cannot delete the last active Super Admin.' }, { status: 400 });
  }

  const ok = await store.deleteUser(params.id);
  if (!ok) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
