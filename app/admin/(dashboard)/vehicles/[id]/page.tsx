import { notFound, redirect } from 'next/navigation';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { PageHeader } from '@/components/admin/ui';
import { VehicleForm } from '@/components/admin/vehicle-form';

export const dynamic = 'force-dynamic';

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (!can(user.role, 'vehicle:edit')) redirect('/admin/vehicles');

  const vehicle = await getStore().getVehicleById(params.id);
  if (!vehicle) notFound();

  return (
    <>
      <PageHeader title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} description={`Stock ${vehicle.stockNumber}`} />
      <VehicleForm
        vehicle={vehicle}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        canDelete={can(user.role, 'vehicle:delete')}
        canCreate={can(user.role, 'vehicle:create')}
      />
    </>
  );
}
