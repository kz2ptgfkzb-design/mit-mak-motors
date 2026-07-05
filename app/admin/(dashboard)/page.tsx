import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  CheckCircle2,
  Clock,
  BadgeCheck,
  FileEdit,
  Inbox,
  Star,
  Plus,
  Sparkles,
  ArrowRight,
  Globe,
  Camera,
  MousePointerClick,
  PhoneCall,
} from 'lucide-react';
import { getStore } from '@/lib/inventory/store';
import { getCurrentUser } from '@/lib/auth/service';
import { can } from '@/lib/auth/rbac';
import { locations } from '@/data/locations';
import { LEAD_KIND_LABELS, type Lead } from '@/lib/inventory/types';
import { Card, StatCard, EmptyState } from '@/components/admin/ui';
import { VehicleStatusBadge, LeadStatusBadge } from '@/components/admin/status-badge';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const locName = (id: string | null) => locations.find((l) => l.id === id)?.name ?? 'Unassigned';

function greeting(): string {
  // South Africa is UTC+2 year-round.
  const h = (new Date().getUTCHours() + 2) % 24;
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel(): string {
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Africa/Johannesburg',
  }).format(new Date());
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const store = getStore();
  const vehicles = await store.listVehicles();
  const showLeads = user ? can(user.role, 'lead:view') : false;
  const canCreate = user ? can(user.role, 'vehicle:create') : false;
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
      {/* ── Welcome hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-ink-950 px-6 py-8 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-red-600/25 blur-[100px]" />
          <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-red-700/15 blur-[110px]" />
        </div>
        <Image
          src="/mit-mak-logo.png"
          alt=""
          aria-hidden
          width={1198}
          height={1198}
          className="pointer-events-none absolute -right-8 top-1/2 h-52 w-auto -translate-y-1/2 object-contain opacity-[0.14] sm:-right-4 sm:h-64"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-red-300/90">{todayLabel()}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase leading-none tracking-tight sm:text-4xl">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-slate-300">
            <span className="font-semibold text-white">{stats.available}</span> cars live in the showroom
            {showLeads && (
              <>
                {' '}· <span className={newLeads > 0 ? 'font-semibold text-red-300' : 'font-semibold text-white'}>{newLeads}</span>{' '}
                new {newLeads === 1 ? 'enquiry' : 'enquiries'} waiting
              </>
            )}
            . Everything you change here updates the website instantly.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {canCreate && (
              <Link
                href="/admin/vehicles/new"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition-all hover:-translate-y-0.5 hover:bg-red-500"
              >
                <Plus className="h-4 w-4" /> Add a vehicle
              </Link>
            )}
            {showLeads && (
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Inbox className="h-4 w-4" /> Enquiries
                {newLeads > 0 && (
                  <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold">
                    {newLeads}
                  </span>
                )}
              </Link>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/40 hover:text-white"
            >
              <Globe className="h-4 w-4" /> View live site
            </Link>
          </div>
        </div>
      </div>

      {/* ── At a glance ──────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Total stock" value={stats.total} tone="slate" icon={<Car className="h-5 w-5" />} />
        <StatCard label="Available" value={stats.available} tone="green" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Reserved" value={stats.reserved} tone="amber" icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Sold" value={stats.sold} tone="violet" icon={<BadgeCheck className="h-5 w-5" />} />
        <StatCard label="Coming soon" value={stats.comingSoon} tone="sky" icon={<Sparkles className="h-5 w-5" />} />
        <StatCard label="Drafts" value={stats.draft} tone="slate" icon={<FileEdit className="h-5 w-5" />} />
        <StatCard label="Featured" value={stats.featured} tone="red" icon={<Star className="h-5 w-5" />} />
        {showLeads && <StatCard label="New enquiries" value={newLeads} tone="red" icon={<Inbox className="h-5 w-5" />} />}
      </div>

      {/* ── Recent activity ──────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold uppercase tracking-tight text-slate-900">Recently added</h2>
            <Link href="/admin/vehicles" className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentVehicles.length === 0 ? (
            <EmptyState title="No vehicles yet" description="Add your first vehicle to get started." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentVehicles.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/admin/vehicles/${v.id}`}
                    className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.images[0]?.url || '/mit-mak-logo.png'}
                      alt=""
                      loading="lazy"
                      className="h-11 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 group-hover:text-red-600">
                        {v.year} {v.make} {v.model}
                      </p>
                      <p className="truncate text-xs text-slate-400">{v.variant || v.stockNumber}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-slate-700">{formatPrice(v.price)}</span>
                    <VehicleStatusBadge status={v.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {showLeads ? (
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold uppercase tracking-tight text-slate-900">Latest enquiries</h2>
              <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {leads.length === 0 ? (
              <EmptyState
                icon={<Inbox className="h-8 w-8" />}
                title="No enquiries yet"
                description="When a customer enquires on the website, it lands here the moment they press send."
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {leads.slice(0, 6).map((l) => (
                  <li key={l.id} className="flex items-center gap-3 px-1 py-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold uppercase text-red-600">
                      {(l.name || '?').slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{l.name}</p>
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
            <h2 className="mb-4 font-display text-base font-semibold uppercase tracking-tight text-slate-900">Recently sold</h2>
            {recentSold.length === 0 ? (
              <EmptyState title="No sold vehicles yet" />
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentSold.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-700">{formatPrice(v.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      {/* ── Insights ─────────────────────────────────────────── */}
      {showLeads && (leadsByBranch.length > 0 || leadsByVehicle.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 font-display text-base font-semibold uppercase tracking-tight text-slate-900">Enquiries by branch</h2>
            <ul className="space-y-2.5">
              {leadsByBranch.map(([branch, n]) => (
                <li key={branch} className="flex items-center gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-slate-600">{branch}</span>
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-red-500"
                      style={{ width: `${Math.round((n / Math.max(1, leadsByBranch[0][1])) * 100)}%` }}
                    />
                  </span>
                  <span className="w-6 text-right font-semibold tabular-nums text-slate-900">{n}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 font-display text-base font-semibold uppercase tracking-tight text-slate-900">Most-enquired vehicles</h2>
            {leadsByVehicle.length === 0 ? (
              <p className="text-sm text-slate-400">No vehicle-specific enquiries yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {leadsByVehicle.map(([title, n]) => (
                  <li key={title} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-slate-600">{title}</span>
                    <span className="font-semibold tabular-nums text-slate-900">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      {/* ── How it works (for every skill level) ─────────────── */}
      <Card className="mt-6 p-5 sm:p-6">
        <h2 className="font-display text-base font-semibold uppercase tracking-tight text-slate-900">How it works</h2>
        <p className="mt-1 text-sm text-slate-500">Three simple steps. No technical knowledge needed.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: <Camera className="h-5 w-5" />,
              step: '1',
              title: 'Add your car',
              body: 'Press "Add a vehicle", fill in the details and add photos. Save it as a draft if you are not finished.',
            },
            {
              icon: <MousePointerClick className="h-5 w-5" />,
              step: '2',
              title: 'Publish it',
              body: 'Set the status to Available and it appears on the website immediately. Mark it Sold or Reserved anytime.',
            },
            {
              icon: <PhoneCall className="h-5 w-5" />,
              step: '3',
              title: 'Answer enquiries',
              body: 'Customer enquiries land in the Enquiries tab with their name and number. Tap to call or email them back.',
            },
          ].map((s) => (
            <div key={s.step} className="relative rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="absolute right-3 top-2 font-display text-3xl font-bold text-slate-200">{s.step}</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">{s.icon}</span>
              <p className="mt-3 text-sm font-semibold text-slate-800">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
