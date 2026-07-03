import { redirect } from 'next/navigation';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { PageHeader } from '@/components/admin/ui';
import { VehicleTable } from '@/components/admin/vehicle-table';

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'vehicle:view')) redirect('/admin');

  const vehicles = await getStore().listVehicles();

  return (
    <>
      <PageHeader title="Vehicles" description={`${vehicles.length} in inventory`} />
      <VehicleTable
        vehicles={vehicles}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        canCreate={can(user.role, 'vehicle:create')}
        canEdit={can(user.role, 'vehicle:edit')}
        canDelete={can(user.role, 'vehicle:delete')}
      />
    </>
  );
}
