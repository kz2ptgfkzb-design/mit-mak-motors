'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Phone, Mail, Trash2, StickyNote, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_KIND_LABELS,
  type Lead,
  type LeadStatus,
} from '@/lib/inventory/types';
import { Input, Select, Button, EmptyState, Spinner } from './ui';
import { LeadStatusBadge } from './status-badge';
import { useToast, useConfirm } from './providers';

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

export function LeadsClient({
  leads,
  locations,
  canEdit,
  canDelete,
}: {
  leads: Lead[];
  locations: { id: string; name: string }[];
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | LeadStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const branchName = (id: string | null) => locations.find((l) => l.id === id)?.name ?? 'Unassigned';

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== 'all' && l.status !== status) return false;
      if (needle) {
        const hay = `${l.name} ${l.email} ${l.phone} ${l.vehicleTitle ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, q, status]);

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  async function setLeadStatus(id: string, s: LeadStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: s }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Update failed');
      toast('Status updated');
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function addNote(id: string) {
    if (!note.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addNote: { body: note.trim() } }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to add note');
      setNote('');
      toast('Note added');
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const ok = await confirm({ title: 'Delete this enquiry?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed');
      toast('Enquiry deleted');
      setSelectedId(null);
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone..." className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-auto">
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Inbox className="h-8 w-8" />} title="No enquiries" description="Website enquiries will appear here as they come in." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedId(l.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.email || l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{LEAD_KIND_LABELS[l.kind]}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">{l.vehicleTitle || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail slide-over */}
      {selected && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelectedId(null)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">{selected.name}</h2>
                <p className="text-xs text-slate-400">
                  {LEAD_KIND_LABELS[selected.kind]} · {fmtDate(selected.createdAt)}
                </p>
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-2 text-slate-700 hover:text-red-600">
                    <Phone className="h-4 w-4 text-slate-400" /> {selected.phone}
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 text-slate-700 hover:text-red-600">
                    <Mail className="h-4 w-4 text-slate-400" /> {selected.email}
                  </a>
                )}
                <p className="text-slate-500">Branch: {branchName(selected.locationId)}</p>
                {selected.vehicleTitle && <p className="text-slate-500">Vehicle: {selected.vehicleTitle}</p>}
              </div>

              {selected.message && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Message</p>
                  <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{selected.message}</p>
                </div>
              )}

              {canEdit && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
                  <Select value={selected.status} disabled={busy} onChange={(e) => setLeadStatus(selected.id, e.target.value as LeadStatus)}>
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {LEAD_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <StickyNote className="h-3.5 w-3.5" /> Notes
                </p>
                {selected.notes.length === 0 ? (
                  <p className="text-sm text-slate-400">No notes yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {selected.notes.map((n) => (
                      <li key={n.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-sm">
                        <p className="text-slate-700">{n.body}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {n.author} · {fmtDate(n.createdAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {canEdit && (
                  <div className="mt-2 flex gap-2">
                    <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." />
                    <Button disabled={busy || !note.trim()} onClick={() => addNote(selected.id)}>
                      {busy ? <Spinner /> : 'Add'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {canDelete && (
              <div className="border-t border-slate-200 px-5 py-3">
                <Button variant="danger" disabled={busy} onClick={() => remove(selected.id)}>
                  <Trash2 className="h-4 w-4" /> Delete enquiry
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
