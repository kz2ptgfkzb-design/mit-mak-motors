'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, FileEdit, Trash2, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import type { InventoryVehicle, VehicleImage, VehicleStatus } from '@/lib/inventory/types';
import { VEHICLE_STATUSES, STATUS_LABELS } from '@/lib/inventory/types';
import { Card, Field, Input, Select, Textarea, Toggle, Button, Spinner } from './ui';
import { ImageManager } from './image-manager';
import { useToast, useConfirm } from './providers';

const TRANSMISSIONS = ['Automatic', 'Manual', 'DCT', 'CVT'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const BODY_TYPES = ['Sedan', 'Coupe', 'SUV', 'Hatchback', 'Cabriolet', 'Single Cab', 'Extended Cab', 'Double Cab', 'Wagon', 'MPV'];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', '4x4'];
const CONDITIONS = ['New', 'Demo', 'Used', 'Excellent', 'Very Good', 'Good'];

interface Props {
  vehicle: InventoryVehicle | null;
  locations: { id: string; name: string }[];
  canDelete: boolean;
  canCreate: boolean;
}

const nStr = (v: number | null | undefined) => (v == null ? '' : String(v));

export function VehicleForm({ vehicle, locations, canDelete, canCreate }: Props) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const isEdit = Boolean(vehicle);

  const [f, setF] = useState({
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    variant: vehicle?.variant ?? '',
    year: nStr(vehicle?.year) || String(new Date().getFullYear()),
    stockNumber: vehicle?.stockNumber ?? '',
    vin: vehicle?.vin ?? '',
    registrationYear: nStr(vehicle?.registrationYear),
    condition: vehicle?.condition ?? 'Used',
    previousOwners: nStr(vehicle?.previousOwners),
    price: nStr(vehicle?.price),
    previousPrice: nStr(vehicle?.previousPrice),
    monthlyRepayment: nStr(vehicle?.monthlyRepayment),
    mileage: nStr(vehicle?.mileage),
    transmission: vehicle?.transmission ?? 'Automatic',
    fuel: vehicle?.fuel ?? 'Petrol',
    bodyType: vehicle?.bodyType ?? 'Sedan',
    driveType: vehicle?.driveType ?? 'FWD',
    color: vehicle?.color ?? '',
    engineSize: vehicle?.engineSize ?? '',
    power: vehicle?.power ?? '',
    doors: nStr(vehicle?.doors) || '4',
    seats: nStr(vehicle?.seats) || '5',
    locationId: vehicle?.locationId ?? (locations[0]?.id ?? ''),
    salesperson: vehicle?.salesperson ?? '',
    serviceHistory: vehicle?.serviceHistory ?? '',
    warranty: vehicle?.warranty ?? '',
    tagline: vehicle?.tagline ?? '',
    shortDescription: vehicle?.shortDescription ?? '',
    fullDescription: vehicle?.fullDescription ?? '',
    slug: vehicle?.slug ?? '',
  });
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? 'draft');
  const [financeAvailable, setFinanceAvailable] = useState(vehicle?.financeAvailable ?? true);
  const [featured, setFeatured] = useState(vehicle?.featured ?? false);
  const [showOnHomepage, setShowOnHomepage] = useState(vehicle?.showOnHomepage ?? false);
  const [keyFeatures, setKeyFeatures] = useState((vehicle?.keyFeatures ?? []).join('\n'));
  const [safetyFeatures, setSafetyFeatures] = useState((vehicle?.safetyFeatures ?? []).join('\n'));
  const [comfortFeatures, setComfortFeatures] = useState((vehicle?.comfortFeatures ?? []).join('\n'));
  const [images, setImages] = useState<VehicleImage[]>(vehicle?.images ?? []);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof f, v: string) => setF((prev) => ({ ...prev, [k]: v }));
  const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
  const numOrNull = (s: string) => (s.trim() === '' ? null : Math.round(Number(s) || 0));

  async function submit(statusOverride?: VehicleStatus) {
    if (!f.make.trim() || !f.model.trim()) {
      toast('Make and model are required.', 'error');
      return;
    }
    const finalStatus = statusOverride ?? status;
    const payload = {
      make: f.make.trim(),
      model: f.model.trim(),
      variant: f.variant.trim(),
      year: Number(f.year) || new Date().getFullYear(),
      stockNumber: f.stockNumber.trim(),
      vin: f.vin.trim() || null,
      registrationYear: numOrNull(f.registrationYear),
      condition: f.condition,
      previousOwners: numOrNull(f.previousOwners),
      price: Math.round(Number(f.price) || 0),
      previousPrice: numOrNull(f.previousPrice),
      monthlyRepayment: numOrNull(f.monthlyRepayment),
      mileage: Math.round(Number(f.mileage) || 0),
      transmission: f.transmission,
      fuel: f.fuel,
      bodyType: f.bodyType,
      driveType: f.driveType,
      color: f.color.trim(),
      engineSize: f.engineSize.trim(),
      power: f.power.trim() || null,
      doors: Number(f.doors) || 0,
      seats: Number(f.seats) || 0,
      locationId: f.locationId,
      salesperson: f.salesperson.trim() || null,
      serviceHistory: f.serviceHistory.trim(),
      warranty: f.warranty.trim() || null,
      tagline: f.tagline.trim(),
      shortDescription: f.shortDescription.trim(),
      fullDescription: f.fullDescription.trim(),
      slug: f.slug.trim() || undefined,
      keyFeatures: lines(keyFeatures),
      safetyFeatures: lines(safetyFeatures),
      comfortFeatures: lines(comfortFeatures),
      images,
      status: finalStatus,
      financeAvailable,
      featured,
      showOnHomepage,
    };

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/vehicles/${vehicle!.id}` : '/api/admin/vehicles', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setStatus(finalStatus);
      toast(isEdit ? 'Vehicle saved' : 'Vehicle created');
      if (isEdit) router.refresh();
      else router.push('/admin/vehicles');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!vehicle) return;
    const ok = await confirm({
      title: 'Delete this vehicle?',
      body: `${vehicle.year} ${vehicle.make} ${vehicle.model} will be permanently removed.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed');
      toast('Vehicle deleted');
      router.push('/admin/vehicles');
    } catch (err) {
      toast((err as Error).message, 'error');
      setSaving(false);
    }
  }

  async function duplicate() {
    if (!vehicle) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}/duplicate`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Duplicate failed');
      toast('Duplicated as a draft');
      router.push(`/admin/vehicles/${data.vehicle.id}`);
    } catch (err) {
      toast((err as Error).message, 'error');
      setSaving(false);
    }
  }

  return (
    <div className="pb-24">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/admin/vehicles" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to vehicles
        </Link>
        {isEdit && vehicle && status !== 'draft' && (
          <Link
            href={`/vehicles/${vehicle.slug}`}
            target="_blank"
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600"
          >
            <ExternalLink className="h-4 w-4" /> View on site
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Identity">
            <Field label="Make" required className="sm:col-span-1">
              <Input value={f.make} onChange={(e) => set('make', e.target.value)} placeholder="BMW" />
            </Field>
            <Field label="Model" required>
              <Input value={f.model} onChange={(e) => set('model', e.target.value)} placeholder="M4" />
            </Field>
            <Field label="Variant / trim">
              <Input value={f.variant} onChange={(e) => set('variant', e.target.value)} placeholder="Competition" />
            </Field>
            <Field label="Year">
              <Input type="number" value={f.year} onChange={(e) => set('year', e.target.value)} />
            </Field>
            <Field label="Stock number" hint="Auto-generated if left blank">
              <Input value={f.stockNumber} onChange={(e) => set('stockNumber', e.target.value)} />
            </Field>
            <Field label="Condition">
              <Select value={f.condition} onChange={(e) => set('condition', e.target.value)}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="VIN">
              <Input value={f.vin} onChange={(e) => set('vin', e.target.value)} />
            </Field>
            <Field label="Registration year">
              <Input type="number" value={f.registrationYear} onChange={(e) => set('registrationYear', e.target.value)} />
            </Field>
            <Field label="Previous owners">
              <Input type="number" value={f.previousOwners} onChange={(e) => set('previousOwners', e.target.value)} />
            </Field>
          </Section>

          <Section title="Pricing & finance">
            <Field label="Price (R)" required>
              <Input type="number" value={f.price} onChange={(e) => set('price', e.target.value)} />
            </Field>
            <Field label="Previous price (R)" hint="Shows a reduced badge">
              <Input type="number" value={f.previousPrice} onChange={(e) => set('previousPrice', e.target.value)} />
            </Field>
            <Field label="Monthly repayment estimate (R)">
              <Input type="number" value={f.monthlyRepayment} onChange={(e) => set('monthlyRepayment', e.target.value)} />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={financeAvailable} onChange={setFinanceAvailable} label="Finance available" />
            </div>
          </Section>

          <Section title="Specifications">
            <Field label="Mileage (km)">
              <Input type="number" value={f.mileage} onChange={(e) => set('mileage', e.target.value)} />
            </Field>
            <Field label="Transmission">
              <Select value={f.transmission} onChange={(e) => set('transmission', e.target.value)}>
                {TRANSMISSIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Fuel type">
              <Select value={f.fuel} onChange={(e) => set('fuel', e.target.value)}>
                {FUELS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Body type">
              <Select value={f.bodyType} onChange={(e) => set('bodyType', e.target.value)}>
                {BODY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Drive type">
              <Select value={f.driveType} onChange={(e) => set('driveType', e.target.value)}>
                {DRIVE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Colour">
              <Input value={f.color} onChange={(e) => set('color', e.target.value)} />
            </Field>
            <Field label="Engine size">
              <Input value={f.engineSize} onChange={(e) => set('engineSize', e.target.value)} placeholder="3.0L Turbo" />
            </Field>
            <Field label="Power">
              <Input value={f.power} onChange={(e) => set('power', e.target.value)} placeholder="375 kW" />
            </Field>
            <Field label="Doors">
              <Input type="number" value={f.doors} onChange={(e) => set('doors', e.target.value)} />
            </Field>
            <Field label="Seats">
              <Input type="number" value={f.seats} onChange={(e) => set('seats', e.target.value)} />
            </Field>
          </Section>

          <Section title="Placement">
            <Field label="Branch / location">
              <Select value={f.locationId} onChange={(e) => set('locationId', e.target.value)}>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Salesperson / contact">
              <Input value={f.salesperson} onChange={(e) => set('salesperson', e.target.value)} />
            </Field>
          </Section>

          <Section title="Description & copy" cols={1}>
            <Field label="Tagline" hint="Short marketing line on the card and hero">
              <Input value={f.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </Field>
            <Field label="Short description">
              <Textarea value={f.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Full description">
              <Textarea
                value={f.fullDescription}
                onChange={(e) => set('fullDescription', e.target.value)}
                className="min-h-[140px]"
              />
            </Field>
          </Section>

          <Section title="Features" cols={1}>
            <Field label="Key features" hint="One per line">
              <Textarea value={keyFeatures} onChange={(e) => setKeyFeatures(e.target.value)} />
            </Field>
            <Field label="Safety features" hint="One per line">
              <Textarea value={safetyFeatures} onChange={(e) => setSafetyFeatures(e.target.value)} />
            </Field>
            <Field label="Comfort & convenience" hint="One per line">
              <Textarea value={comfortFeatures} onChange={(e) => setComfortFeatures(e.target.value)} />
            </Field>
          </Section>

          <Section title="Provenance" cols={1}>
            <Field label="Service history">
              <Textarea value={f.serviceHistory} onChange={(e) => set('serviceHistory', e.target.value)} />
            </Field>
            <Field label="Warranty">
              <Input value={f.warranty} onChange={(e) => set('warranty', e.target.value)} />
            </Field>
          </Section>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Images</h2>
            <ImageManager images={images} onChange={setImages} />
          </Card>
        </div>

        {/* Sidebar: status & visibility + actions */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Status & visibility</h2>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as VehicleStatus)}>
                {VEHICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="mt-4 space-y-3">
              <Toggle checked={featured} onChange={setFeatured} label="Featured vehicle" />
              <Toggle checked={showOnHomepage} onChange={setShowOnHomepage} label="Show on homepage" />
            </div>
            <Field label="URL slug" hint="Auto-generated from make/model if blank" className="mt-4">
              <Input value={f.slug} onChange={(e) => set('slug', e.target.value)} placeholder="2023-bmw-m4-competition" />
            </Field>
          </Card>

          <Card className="sticky top-20 p-5">
            <div className="space-y-2">
              {isEdit ? (
                <Button className="w-full" disabled={saving} onClick={() => submit()}>
                  {saving ? <Spinner /> : <Save className="h-4 w-4" />} Save changes
                </Button>
              ) : (
                <>
                  <Button className="w-full" disabled={saving} onClick={() => submit('available')}>
                    {saving ? <Spinner /> : <Save className="h-4 w-4" />} Publish
                  </Button>
                  <Button variant="outline" className="w-full" disabled={saving} onClick={() => submit('draft')}>
                    <FileEdit className="h-4 w-4" /> Save as draft
                  </Button>
                </>
              )}
              {isEdit && canCreate && (
                <Button variant="outline" className="w-full" disabled={saving} onClick={duplicate}>
                  <Copy className="h-4 w-4" /> Duplicate
                </Button>
              )}
              {isEdit && canDelete && (
                <Button variant="danger" className="w-full" disabled={saving} onClick={remove}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, cols = 2, children }: { title: string; cols?: 1 | 2; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className={cols === 1 ? 'space-y-4' : 'grid grid-cols-1 gap-4 sm:grid-cols-2'}>{children}</div>
    </Card>
  );
}
