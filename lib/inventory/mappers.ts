// Maps the rich admin model (InventoryVehicle) onto the lean public
// `Vehicle` type consumed by the showroom, detail pages, cards, etc.
// Keeping this in one place means the whole public site stays in sync
// with whatever the admin edits.

import type { Vehicle, FeatureGroup } from '@/types';
import type { InventoryVehicle } from './types';

/**
 * Strip em/en dashes from any copy that flows to the public site.
 * House style: hyphens and the middot only (see HANDOFF copy rule).
 */
export function normalizeText(s: string | null | undefined): string {
  if (!s) return '';
  return s.replace(/[—–]/g, '-').replace(/\s{2,}/g, ' ').trim();
}

export function vehicleTitle(v: Pick<Vehicle, 'year' | 'make' | 'model' | 'variant'>): string {
  return `${v.year} ${v.make} ${v.model} ${v.variant}`.replace(/\s+/g, ' ').trim();
}

export function buildFeatureGroups(inv: InventoryVehicle): FeatureGroup[] {
  const groups: FeatureGroup[] = [
    { category: 'Key Features', items: inv.keyFeatures },
    { category: 'Safety', items: inv.safetyFeatures },
    { category: 'Comfort & Convenience', items: inv.comfortFeatures },
  ];
  return groups
    .map((g) => ({ category: g.category, items: g.items.map(normalizeText).filter(Boolean) }))
    .filter((g) => g.items.length > 0);
}

/** Placeholder shown when a listing has no photos yet (keeps images[0] defined). */
export const IMAGE_PLACEHOLDER = '/mit-mak-logo.png';

/** Ordered image URLs (images[0] is the hero). Always at least one entry. */
export function imageUrls(inv: InventoryVehicle): string[] {
  const urls = inv.images.map((i) => i.url).filter(Boolean);
  return urls.length > 0 ? urls : [IMAGE_PLACEHOLDER];
}

export function imageAlts(inv: InventoryVehicle): string[] {
  const title = vehicleTitle(inv);
  return inv.images.map((i, idx) => normalizeText(i.alt) || `${title} - photo ${idx + 1}`);
}

export function toPublicVehicle(inv: InventoryVehicle): Vehicle {
  const highlights = inv.keyFeatures.length
    ? inv.keyFeatures.slice(0, 4).map(normalizeText)
    : ['Inspected & reconditioned', 'Full report available', 'Delivered free nationwide', 'Warranty included'];

  return {
    id: inv.id,
    slug: inv.slug,
    tagline: normalizeText(inv.tagline) || normalizeText(inv.shortDescription),
    make: inv.make,
    model: inv.model,
    variant: inv.variant,
    year: inv.year,
    price: inv.price,
    previousPrice: inv.previousPrice ?? undefined,
    reserved: inv.status === 'reserved',
    sold: inv.status === 'sold',
    comingSoon: inv.status === 'coming_soon',
    featured: inv.featured,
    bodyType: inv.bodyType,
    driveType: inv.driveType,
    transmission: inv.transmission,
    fuel: inv.fuel,
    mileage: inv.mileage,
    engineSize: normalizeText(inv.engineSize) || '-',
    power: inv.power ?? undefined,
    doors: inv.doors,
    seats: inv.seats,
    color: inv.color,
    condition: inv.condition,
    stockNumber: inv.stockNumber,
    vin: inv.vin ?? undefined,
    dateAdded: inv.dateAdded,
    locationId: inv.locationId,
    images: imageUrls(inv),
    description: normalizeText(inv.fullDescription),
    highlights,
    features: buildFeatureGroups(inv),
    serviceHistory: normalizeText(inv.serviceHistory),
    warranty: inv.warranty ? normalizeText(inv.warranty) : undefined,
  };
}

/** Card projection — small payload for client lists (mirrors data/vehicles.ts toCard). */
export function toPublicCard(inv: InventoryVehicle): Vehicle {
  const v = toPublicVehicle(inv);
  return { ...v, images: v.images.slice(0, 2), features: [], description: '', serviceHistory: '', highlights: [] };
}
