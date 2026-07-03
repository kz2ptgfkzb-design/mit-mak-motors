// Maps the scraped data/vehicles.json (public Vehicle shape) into the rich
// admin InventoryVehicle model. This is the seed dataset used by:
//   • the file-store fallback (dev / demo without a database)
//   • scripts/seed.mjs (importing into Postgres)
//   • the public read layer's safety fallback (site never renders empty)

import type { Vehicle } from '@/types';
import raw from '@/data/vehicles.json';
import type { InventoryVehicle, VehicleImage } from './types';
import { normalizeText } from './mappers';

function flattenFeatures(v: Vehicle): string[] {
  const fromGroups = (v.features ?? []).flatMap((g) => g.items ?? []);
  const all = [...fromGroups, ...(v.highlights ?? [])];
  return Array.from(new Set(all.map(normalizeText).filter(Boolean)));
}

function seededTimestamp(v: Vehicle): string {
  // dateAdded is a YYYY-MM-DD string; normalise to ISO.
  const d = v.dateAdded && /^\d{4}-\d{2}-\d{2}/.test(v.dateAdded) ? `${v.dateAdded.slice(0, 10)}T09:00:00.000Z` : null;
  return d ?? '2024-01-01T09:00:00.000Z';
}

function mapSeed(v: Vehicle): InventoryVehicle {
  const images: VehicleImage[] = (v.images ?? []).map((url) => ({ url }));
  const ts = seededTimestamp(v);
  const status: InventoryVehicle['status'] = v.sold
    ? 'sold'
    : v.reserved
      ? 'reserved'
      : v.comingSoon
        ? 'coming_soon'
        : 'available';

  return {
    id: v.slug,
    slug: v.slug,
    stockNumber: v.stockNumber || '',
    make: v.make,
    model: v.model,
    variant: v.variant,
    year: v.year,
    price: v.price,
    previousPrice: v.previousPrice ?? null,
    financeAvailable: true,
    monthlyRepayment: null,
    mileage: v.mileage,
    transmission: v.transmission,
    fuel: v.fuel,
    bodyType: v.bodyType,
    driveType: v.driveType,
    color: v.color,
    engineSize: normalizeText(v.engineSize) || '',
    power: v.power ?? null,
    doors: v.doors,
    seats: v.seats,
    vin: v.vin ?? null,
    registrationYear: null,
    condition: v.condition,
    previousOwners: null,
    serviceHistory: normalizeText(v.serviceHistory),
    warranty: v.warranty ? normalizeText(v.warranty) : null,
    locationId: v.locationId,
    salesperson: null,
    tagline: normalizeText(v.tagline),
    shortDescription: normalizeText(v.tagline),
    fullDescription: normalizeText(v.description),
    keyFeatures: flattenFeatures(v),
    safetyFeatures: [],
    comfortFeatures: [],
    images,
    status,
    featured: Boolean(v.featured),
    showOnHomepage: Boolean(v.featured),
    dateAdded: ts,
    createdAt: ts,
    updatedAt: ts,
  };
}

let cache: InventoryVehicle[] | null = null;

/** The full seed inventory as admin records (memoised). */
export function seedVehicles(): InventoryVehicle[] {
  if (!cache) cache = (raw as unknown as Vehicle[]).map(mapSeed);
  return cache;
}
