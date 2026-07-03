import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { PageHeader } from '@/components/admin/ui';
import { VehicleForm } from '@/components/admin/vehicle-form';

export const dynamic = 'force-dynamic';

export default async function NewVehiclePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'vehicle:create')) redirect('/admin/vehicles');

  return (
    <>
      <PageHeader title="Add vehicle" description="Create a new listing. Save as a draft or publish straight to the showroom." />
      <VehicleForm
        vehicle={null}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        canDelete={can(user.role, 'vehicle:delete')}
        canCreate
      />
    </>
  );
}
