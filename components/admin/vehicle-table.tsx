'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Copy,
  Trash2,
  Star,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Car,
} from 'lucide-react';
import { cn, formatPrice, formatMileage } from '@/lib/utils';
import {
  VEHICLE_STATUSES,
  STATUS_LABELS,
  type InventoryVehicle,
  type VehicleStatus,
} from '@/lib/inventory/types';
import { Button, Input, Select, EmptyState } from './ui';
import { VehicleStatusBadge } from './status-badge';
import { useToast, useConfirm } from './providers';

interface Props {
  vehicles: InventoryVehicle[];
  locations: { id: string; name: string }[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

type SortKey = 'newest' | 'oldest' | 'price-desc' | 'price-asc' | 'mileage-asc' | 'status';
const PAGE_SIZE = 20;

// Colour cue next to the status dropdown so state reads at a glance.
const STATUS_DOT: Record<VehicleStatus, string> = {
  available: 'bg-emerald-500',
  reserved: 'bg-amber-500',
  sold: 'bg-slate-400',
  coming_soon: 'bg-sky-500',
  draft: 'bg-slate-300',
};

export function VehicleTable({ vehicles, locations, canCreate, canEdit, canDelete }: Props) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | VehicleStatus>('all');
  const [make, setMake] = useState('all');
  const [branch, setBranch] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const makes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))).sort(), [vehicles]);
  const branchName = (id: string) => locations.find((l) => l.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = vehicles.filter((v) => {
      if (status !== 'all' && v.status !== status) return false;
      if (make !== 'all' && v.make !== make) return false;
      if (branch !== 'all' && v.locationId !== branch) return false;
      if (needle) {
        const hay = `${v.year} ${v.make} ${v.model} ${v.variant} ${v.stockNumber}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.dateAdded < b.dateAdded ? -1 : 1;
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'mileage-asc':
          return a.mileage - b.mileage;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return a.dateAdded < b.dateAdded ? 1 : -1;
      }
    });
    return list;
  }, [vehicles, q, status, make, branch, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((v) => selected.has(v.id));

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAllOnPage() {
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) pageRows.forEach((v) => next.delete(v.id));
      else pageRows.forEach((v) => next.add(v.id));
      return next;
    });
  }

  async function patchVehicle(id: string, body: Record<string, unknown>, successMsg: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed');
      toast(successMsg);
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function remove(v: InventoryVehicle) {
    const ok = await confirm({
      title: 'Delete this vehicle?',
      body: `${v.year} ${v.make} ${v.model} will be permanently removed from the inventory.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${v.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed');
      toast('Vehicle deleted');
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function duplicate(v: InventoryVehicle) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${v.id}/duplicate`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Duplicate failed');
      toast('Vehicle duplicated as a draft');
      if (data.vehicle?.id) router.push(`/admin/vehicles/${data.vehicle.id}`);
      else router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function bulk(action: string, extra: Record<string, unknown>, msg: string, danger = false) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (danger) {
      const ok = await confirm({
        title: `Delete ${ids.length} vehicle${ids.length > 1 ? 's' : ''}?`,
        body: 'This cannot be undone.',
        confirmLabel: 'Delete',
        danger: true,
      });
      if (!ok) return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/vehicles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Bulk action failed');
      toast(`${msg} (${data.updated})`);
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search make, model, stock number..."
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(0); }} className="w-auto">
          <option value="all">All statuses</option>
          {VEHICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select value={make} onChange={(e) => { setMake(e.target.value); setPage(0); }} className="w-auto">
          <option value="all">All makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(0); }} className="w-auto">
          <option value="all">All branches</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-auto">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price-desc">Price: high to low</option>
          <option value="price-asc">Price: low to high</option>
          <option value="mileage-asc">Mileage: low to high</option>
          <option value="status">Status</option>
        </Select>
        {canCreate && (
          <Link href="/admin/vehicles/new" className="ml-auto">
            <Button>
              <Plus className="h-4 w-4" /> Add vehicle
            </Button>
          </Link>
        )}
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="font-medium text-slate-700">{selected.size} selected</span>
          {canEdit && (
            <>
              <Select
                className="w-auto text-xs"
                value=""
                onChange={(e) => e.target.value && bulk('status', { status: e.target.value }, 'Status updated')}
                disabled={busy}
              >
                <option value="">Set status...</option>
                {VEHICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => bulk('featured', { value: true }, 'Featured')}>
                Feature
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => bulk('featured', { value: false }, 'Unfeatured')}>
                Unfeature
              </Button>
            </>
          )}
          {canDelete && (
            <Button size="sm" variant="danger" disabled={busy} onClick={() => bulk('delete', {}, 'Deleted', true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-500 hover:text-slate-700">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Car className="h-8 w-8" />}
          title="No vehicles match"
          description="Try clearing filters or adjusting your search."
          action={canCreate ? <Link href="/admin/vehicles/new"><Button><Plus className="h-4 w-4" /> Add vehicle</Button></Link> : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} aria-label="Select all on page" />
                </th>
                <th className="px-3 py-3">Vehicle</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Mileage</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-center">Featured</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((v) => (
                <tr key={v.id} className={cn('hover:bg-slate-50', selected.has(v.id) && 'bg-red-50/40')}>
                  <td className="px-3 py-2.5">
                    <input type="checkbox" checked={selected.has(v.id)} onChange={() => toggle(v.id)} aria-label={`Select ${v.make} ${v.model}`} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.images[0]?.url || '/mit-mak-logo.png'}
                        alt=""
                        className="h-12 w-[68px] shrink-0 rounded-lg bg-slate-100 object-cover ring-1 ring-slate-200"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <Link href={`/admin/vehicles/${v.id}`} className="block truncate font-medium text-slate-800 hover:text-red-600">
                          {v.year} {v.make} {v.model}
                        </Link>
                        <span className="block truncate text-xs text-slate-400">
                          {v.variant} · {v.stockNumber} · {branchName(v.locationId)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <EditableNumber
                      value={v.price}
                      display={formatPrice(v.price)}
                      editable={canEdit}
                      active={editing === `${v.id}:price`}
                      onEdit={() => setEditing(`${v.id}:price`)}
                      onCancel={() => setEditing(null)}
                      onSave={(n) => {
                        setEditing(null);
                        if (n !== v.price) patchVehicle(v.id, { price: n }, 'Price updated');
                      }}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <EditableNumber
                      value={v.mileage}
                      display={formatMileage(v.mileage)}
                      editable={canEdit}
                      active={editing === `${v.id}:mileage`}
                      onEdit={() => setEditing(`${v.id}:mileage`)}
                      onCancel={() => setEditing(null)}
                      onSave={(n) => {
                        setEditing(null);
                        if (n !== v.mileage) patchVehicle(v.id, { mileage: n }, 'Mileage updated');
                      }}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    {canEdit ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn('h-2 w-2 shrink-0 rounded-full', STATUS_DOT[v.status])} aria-hidden />
                        <select
                          value={v.status}
                          disabled={busy}
                          onChange={(e) => patchVehicle(v.id, { status: e.target.value }, 'Status updated')}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-red-400 focus:outline-none"
                        >
                          {VEHICLE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </span>
                    ) : (
                      <VehicleStatusBadge status={v.status} />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      disabled={!canEdit || busy}
                      onClick={() => patchVehicle(v.id, { featured: !v.featured }, v.featured ? 'Unfeatured' : 'Featured')}
                      className="disabled:opacity-40"
                      aria-label="Toggle featured"
                    >
                      <Star className={cn('h-4 w-4', v.featured ? 'fill-red-500 text-red-500' : 'text-slate-300')} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/vehicles/${v.id}`}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {canCreate && (
                        <button
                          onClick={() => duplicate(v)}
                          disabled={busy}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => remove(v)}
                          disabled={busy}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>
            {safePage * PAGE_SIZE + 1}-{Math.min(filtered.length, (safePage + 1) * PAGE_SIZE)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span className="tabular-nums">
              {safePage + 1} / {pageCount}
            </span>
            <Button variant="outline" size="sm" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableNumber({
  value,
  display,
  editable,
  active,
  onEdit,
  onCancel,
  onSave,
}: {
  value: number;
  display: string;
  editable: boolean;
  active: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (n: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  if (!editable) return <span className="tabular-nums text-slate-600">{display}</span>;
  if (!active) {
    return (
      <button
        onClick={() => {
          setDraft(String(value));
          onEdit();
        }}
        className="group inline-flex items-center gap-1 tabular-nums text-slate-700 hover:text-red-600"
      >
        {display}
        <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(Math.max(0, Math.round(Number(draft) || 0)));
          if (e.key === 'Escape') onCancel();
        }}
        className="w-24 rounded border border-slate-300 px-1.5 py-0.5 text-sm focus:border-red-400 focus:outline-none"
      />
      <button onClick={() => onSave(Math.max(0, Math.round(Number(draft) || 0)))} className="text-emerald-600" aria-label="Save">
        <Check className="h-4 w-4" />
      </button>
      <button onClick={onCancel} className="text-slate-400" aria-label="Cancel">
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}
