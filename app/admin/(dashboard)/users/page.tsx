import { redirect } from 'next/navigation';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { toSafeUser } from '@/lib/inventory/types';
import { PageHeader } from '@/components/admin/ui';
import { UsersClient } from '@/components/admin/users-client';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'user:manage')) redirect('/admin');

  const users = (await getStore().listUsers()).map(toSafeUser);

  return (
    <>
      <PageHeader title="Users" description="Manage who can access the dashboard and what they can do." />
      <UsersClient users={users} currentUserId={user.id} />
    </>
  );
}
