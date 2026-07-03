'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { ROLES, ROLE_LABELS, type SafeUser, type Role } from '@/lib/inventory/types';
import { Card, Button, Input, Select, Field, Toggle, EmptyState, Spinner } from './ui';
import { useToast, useConfirm } from './providers';

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-ZA', { dateStyle: 'medium' }) : 'Never');

type Editing = { mode: 'create' } | { mode: 'edit'; user: SafeUser } | null;

export function UsersClient({ users, currentUserId }: { users: SafeUser[]; currentUserId: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Editing>(null);
  const [busy, setBusy] = useState(false);

  async function remove(u: SafeUser) {
    const ok = await confirm({
      title: `Delete ${u.name || u.email}?`,
      body: 'This user will lose all access immediately.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed');
      toast('User deleted');
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing({ mode: 'create' })}>
          <UserPlus className="h-4 w-4" /> Add user
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {u.name || '-'}
                      {u.id === currentUserId && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                    </p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ROLE_LABELS[u.role]}</td>
                  <td className="px-4 py-3">
                    <span className={u.active ? 'text-emerald-600' : 'text-slate-400'}>{u.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(u.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing({ mode: 'edit', user: u })}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => remove(u)}
                          disabled={busy}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete user"
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

      {editing && (
        <UserModal
          editing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function UserModal({ editing, onClose, onSaved }: { editing: Exclude<Editing, null>; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const isEdit = editing.mode === 'edit';
  const existing = isEdit ? editing.user : null;
  const [email, setEmail] = useState(existing?.email ?? '');
  const [name, setName] = useState(existing?.name ?? '');
  const [role, setRole] = useState<Role>(existing?.role ?? 'sales');
  const [active, setActive] = useState(existing?.active ?? true);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/users/${existing!.id}` : '/api/admin/users';
      const body = isEdit
        ? { name, role, active, ...(password ? { password } : {}) }
        : { email, name, role, password };
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast(isEdit ? 'User updated' : 'User created');
      onSaved();
    } catch (err) {
      toast((err as Error).message, 'error');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <Card className="relative w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit user' : 'Add user'}</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Email" required>
            <Input type="email" value={email} disabled={isEdit} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={isEdit ? 'New password (leave blank to keep)' : 'Password'} hint="At least 8 characters">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          {isEdit && <Toggle checked={active} onChange={setActive} label="Active" />}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Spinner /> : null} {isEdit ? 'Save' : 'Create user'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
