import { redirect } from 'next/navigation';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { PageHeader } from '@/components/admin/ui';
import { LeadsClient } from '@/components/admin/leads-client';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'lead:view')) redirect('/admin');

  const leads = await getStore().listLeads();
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <>
      <PageHeader title="Enquiries" description={`${leads.length} total · ${newCount} new`} />
      <LeadsClient
        leads={leads}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        canEdit={can(user.role, 'lead:edit')}
        canDelete={can(user.role, 'lead:delete')}
      />
    </>
  );
}
