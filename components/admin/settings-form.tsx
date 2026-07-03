'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import type { SiteSettings } from '@/lib/inventory/types';
import { Card, Field, Input, Toggle, Button, Spinner } from './ui';
import { useToast } from './providers';

export function SettingsForm({
  settings,
  locations,
}: {
  settings: SiteSettings;
  locations: { id: string; name: string }[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [dealershipName, setDealershipName] = useState(settings.dealershipName);
  const [notifyEmail, setNotifyEmail] = useState(settings.notifyEmail);
  const [hideSold, setHideSold] = useState(settings.hideSoldVehicles);
  const [currency, setCurrency] = useState(settings.currency || 'ZAR');
  const [branchEmails, setBranchEmails] = useState<Record<string, string>>(settings.branchEmails ?? {});
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealershipName, notifyEmail, hideSoldVehicles: hideSold, currency, branchEmails }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      toast('Settings saved');
      router.refresh();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Dealership</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Dealership name">
            <Input value={dealershipName} onChange={(e) => setDealershipName(e.target.value)} />
          </Field>
          <Field label="Currency">
            <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Showroom</h2>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-800">Hide sold vehicles from the public site</p>
            <p className="mt-0.5 text-sm text-slate-500">
              When off, sold cars stay visible with a &ldquo;Sold&rdquo; badge. When on, they are removed from the showroom
              entirely.
            </p>
          </div>
          <Toggle checked={hideSold} onChange={setHideSold} />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Enquiry notifications</h2>
        <p className="mb-4 text-sm text-slate-500">
          Where new website enquiries are emailed. Requires an email service (RESEND_API_KEY); until then, enquiries are
          still saved and shown in the dashboard.
        </p>
        <Field label="Default notification email">
          <Input type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="sales@mitmakmotors.co.za" />
        </Field>
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Per-branch override (optional)</p>
          <div className="space-y-2">
            {locations.map((l) => (
              <div key={l.id} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_1.5fr]">
                <span className="text-sm text-slate-500">{l.name}</span>
                <Input
                  type="email"
                  value={branchEmails[l.id] ?? ''}
                  onChange={(e) => setBranchEmails((prev) => ({ ...prev, [l.id]: e.target.value }))}
                  placeholder="branch@mitmakmotors.co.za"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? <Spinner /> : <Save className="h-4 w-4" />} Save settings
        </Button>
      </div>
    </div>
  );
}
