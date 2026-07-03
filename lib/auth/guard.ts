import 'server-only';
import { NextResponse } from 'next/server';
import { getCurrentUser } from './service';
import { can, type Permission } from './rbac';
import type { SafeUser } from '@/lib/inventory/types';

/** Returns the current user, or a 401 NextResponse if not authenticated. */
export async function requireUser(): Promise<SafeUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return user;
}

/** Returns the current user, or a 401/403 NextResponse if not permitted. */
export async function requirePermission(permission: Permission): Promise<SafeUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(user.role, permission)) {
    return NextResponse.json({ error: 'You do not have permission to do that.' }, { status: 403 });
  }
  return user;
}

export function denied(result: SafeUser | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
