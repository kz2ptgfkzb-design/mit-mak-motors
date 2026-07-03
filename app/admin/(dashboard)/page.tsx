import Link from 'next/link';
import { Car, CheckCircle2, Clock, BadgeCheck, FileEdit, Inbox, Star, Plus, Sparkles } from 'lucide-react';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { LEAD_KIND_LABELS, type Lead } from '@/lib/inventory/types';
import { Card, PageHeader, StatCard, Button, EmptyState } from '@/components/admin/ui';
import { VehicleStatusBadge, LeadStatusBadge } from '@/components/admin/status-badge';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const locName = (id: string | null) => locations.find((l) => l.id === id)?.name ?? 'Unassigned';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const store = getStore();
  const vehicles = await store.listVehicles();
  const showLeads = user ? can(user.role, 'lead:view') : false;
  const leads: Lead[] = showLeads ? await store.listLeads() : [];

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'available').length,
    reserved: vehicles.filter((v) => v.status === 'reserved').length,
    sold: vehicles.filter((v) => v.status === 'sold').length,
    comingSoon: vehicles.filter((v) => v.status === 'coming_soon').length,
    draft: vehicles.filter((v) => v.status === 'draft').length,
    featured: vehicles.filter((v) => v.featured).length,
  };

  const newLeads = leads.filter((l) => l.status === 'new').length;
  const recentVehicles = [...vehicles].slice(0, 6);
  const recentSold = vehicles.filter((v) => v.status === 'sold').slice(0, 5);

  const leadsByBranch = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const key = locName(l.locationId);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const leadsByVehicle = Object.entries(
    leads
      .filter((l) => l.vehicleTitle)
      .reduce<Record<string, number>>((acc, l) => {
        const key = l.vehicleTitle as string;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`} description="Your dealership at a glance.">
        {user && can(user.role, 'vehicle:create') && (
          <Link href="/admin/vehicles/new">
            <Button>
              <Plus className="h-4 w-4" /> Add vehicle
            </Button>
          </Link>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total stock" value={stats.total} icon={<Car className="h-5 w-5" />} />
        <StatCard label="Available" value={stats.available} accent="text-emerald-600" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Reserved" value={stats.reserved} accent="text-amber-600" icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Sold" value={stats.sold} icon={<BadgeCheck className="h-5 w-5" />} />
        <StatCard label="Coming soon" value={stats.comingSoon} accent="text-sky-600" icon={<Sparkles className="h-5 w-5" />} />
        <StatCard label="Drafts" value={stats.draft} icon={<FileEdit className="h-5 w-5" />} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Featured" value={stats.featured} accent="text-red-600" icon={<Star className="h-5 w-5" />} />
        {showLeads && (
          <>
            <StatCard label="New enquiries" value={newLeads} accent="text-red-600" icon={<Inbox className="h-5 w-5" />} />
            <StatCard label="Total enquiries" value={leads.length} icon={<Inbox className="h-5 w-5" />} />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recently added</h2>
            <Link href="/admin/vehicles" className="text-sm text-red-600 hover:underline">
              View all
            </Link>
          </div>
          {recentVehicles.length === 0 ? (
            <EmptyState title="No vehicles yet" description="Add your first vehicle to get started." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentVehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/vehicles/${v.id}`} className="min-w-0 flex-1 truncate text-sm text-slate-700 hover:text-red-600">
                    {v.year} {v.make} {v.model} {v.variant}
                  </Link>
                  <span className="text-sm tabular-nums text-slate-500">{formatPrice(v.price)}</span>
                  <VehicleStatusBadge status={v.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {showLeads ? (
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Latest enquiries</h2>
              <Link href="/admin/leads" className="text-sm text-red-600 hover:underline">
                View all
              </Link>
            </div>
            {leads.length === 0 ? (
              <EmptyState title="No enquiries yet" description="Website enquiries will appear here." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {leads.slice(0, 6).map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700">{l.name}</p>
                      <p className="truncate text-xs text-slate-400">
                        {LEAD_KIND_LABELS[l.kind]}
                        {l.vehicleTitle ? ` · ${l.vehicleTitle}` : ''}
                      </p>
                    </div>
                    <LeadStatusBadge status={l.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : (
          <Card className="p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Recently sold</h2>
            {recentSold.length === 0 ? (
              <EmptyState title="No sold vehicles yet" />
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentSold.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="text-sm tabular-nums text-slate-500">{formatPrice(v.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      {showLeads && (leadsByBranch.length > 0 || leadsByVehicle.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Enquiries by branch</h2>
            <ul className="space-y-2">
              {leadsByBranch.map(([branch, n]) => (
                <li key={branch} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{branch}</span>
                  <span className="font-medium tabular-nums text-slate-900">{n}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Most-enquired vehicles</h2>
            {leadsByVehicle.length === 0 ? (
              <p className="text-sm text-slate-400">No vehicle-specific enquiries yet.</p>
            ) : (
              <ul className="space-y-2">
                {leadsByVehicle.map(([title, n]) => (
                  <li key={title} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-slate-600">{title}</span>
                    <span className="font-medium tabular-nums text-slate-900">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
