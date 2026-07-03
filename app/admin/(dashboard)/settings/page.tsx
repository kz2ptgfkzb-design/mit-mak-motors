import { redirect } from 'next/navigation';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { PageHeader } from '@/components/admin/ui';
import { SettingsForm } from '@/components/admin/settings-form';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'settings:manage')) redirect('/admin');

  const settings = await getStore().getSettings();

  return (
    <>
      <PageHeader title="Settings" description="Configure how the showroom and enquiries behave." />
      <SettingsForm settings={settings} locations={locations.map((l) => ({ id: l.id, name: l.name }))} />
    </>
  );
}
