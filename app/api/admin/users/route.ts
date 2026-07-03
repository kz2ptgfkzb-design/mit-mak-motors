import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { requirePermission, denied } from '@/lib/auth/guard';
import { userCreateSchema, zodMessage } from '@/lib/inventory/validation';
import { hashPassword } from '@/lib/auth/password';
import { toSafeUser } from '@/lib/inventory/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requirePermission('user:manage');
  if (denied(gate)) return gate;
  const users = (await getStore().listUsers()).map(toSafeUser);
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const gate = await requirePermission('user:manage');
  if (denied(gate)) return gate;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 422 });

  const store = getStore();
  const existing = await store.getUserByEmail(parsed.data.email);
  if (existing) return NextResponse.json({ error: 'A user with that email already exists.' }, { status: 409 });

  const user = await store.createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role,
    passwordHash: await hashPassword(parsed.data.password),
    active: true,
  });
  return NextResponse.json({ user: toSafeUser(user) }, { status: 201 });
}
