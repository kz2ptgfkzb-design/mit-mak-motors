import type { Role } from '@/lib/inventory/types';

// Fine-grained permissions. Routes and UI both consult `can()` so access rules
// live in exactly one place.
export type Permission =
  | 'vehicle:view'
  | 'vehicle:create'
  | 'vehicle:edit'
  | 'vehicle:publish'
  | 'vehicle:delete'
  | 'lead:view'
  | 'lead:edit'
  | 'lead:delete'
  | 'user:manage'
  | 'settings:manage';

const MATRIX: Record<Role, Permission[]> = {
  super_admin: [
    'vehicle:view',
    'vehicle:create',
    'vehicle:edit',
    'vehicle:publish',
    'vehicle:delete',
    'lead:view',
    'lead:edit',
    'lead:delete',
    'user:manage',
    'settings:manage',
  ],
  manager: [
    'vehicle:view',
    'vehicle:create',
    'vehicle:edit',
    'vehicle:publish',
    'vehicle:delete',
    'lead:view',
    'lead:edit',
    'lead:delete',
    'settings:manage',
  ],
  sales: [
    'vehicle:view',
    'vehicle:create',
    'vehicle:edit',
    'vehicle:publish',
    'lead:view',
    'lead:edit',
  ],
  viewer: ['vehicle:view', 'lead:view'],
};

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(permission) ?? false;
}

export function permissionsFor(role: Role): Permission[] {
  return MATRIX[role] ?? [];
}

/** Whether a role may reach the admin area at all (everyone with a role can). */
export function canAccessAdmin(role: Role | undefined | null): boolean {
  return Boolean(role && MATRIX[role]);
}
