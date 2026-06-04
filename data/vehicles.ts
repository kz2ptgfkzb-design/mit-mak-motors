import type { Vehicle, BodyType, DriveType, FuelType, Transmission } from '@/types';
import raw from './vehicles.json';

// ─────────────────────────────────────────────────────────────
// Live inventory imported from mitmakmotors.co.za via
// scripts/scrape-inventory.mjs. Re-run that script to refresh.
// Images are hosted on AutoTrader's CDN and mapped per-vehicle.
// ─────────────────────────────────────────────────────────────

// `id` = slug guarantees uniqueness (stock numbers can repeat across listings).
export const vehicles = (raw as unknown as Vehicle[]).map((v) => ({ ...v, id: v.slug }));

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

/**
 * Lightweight card projection. Client components (showroom, featured carousel,
 * hero) receive these, never the full 1.5 MB dataset, keeping JS payloads
 * small. Heavy fields (full gallery, prose, features) stay server-side.
 */
export function toCard(v: Vehicle): Vehicle {
  return { ...v, images: v.images.slice(0, 2), features: [], description: '', serviceHistory: '', highlights: [] };
}

export const vehicleCards: Vehicle[] = vehicles.map(toCard);

export const featuredVehicles = vehicles.filter((v) => v.featured);
export const featuredCards = vehicleCards.filter((v) => v.featured);

// Hero tag = their real BMW M4 (matches the BMW M4 hero image).
export const heroVehicle =
  vehicles.find((v) => v.slug === '2015-bmw-m4-coupe-auto') ??
  vehicles.find((v) => /bmw/i.test(v.make) && /m4/i.test(v.model + v.variant)) ??
  [...vehicles].sort((a, b) => b.price - a.price).find((v) => v.images.length >= 6) ??
  vehicles[0];

export function relatedVehicles(vehicle: Vehicle, limit = 4): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== vehicle.id && !v.sold)
    .map((v) => {
      let score = 0;
      if (v.bodyType === vehicle.bodyType) score += 3;
      if (v.make === vehicle.make) score += 2;
      if (Math.abs(v.price - vehicle.price) < 150000) score += 2;
      if (v.driveType === vehicle.driveType) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.v);
}

// Taxonomy derived from inventory so filters always match real stock.
export const allMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
export const allBodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType))) as BodyType[];
export const allDriveTypes = Array.from(new Set(vehicles.map((v) => v.driveType))) as DriveType[];
export const allFuelTypes = Array.from(new Set(vehicles.map((v) => v.fuel))) as FuelType[];
export const allTransmissions = Array.from(new Set(vehicles.map((v) => v.transmission))) as Transmission[];

export const modelsByMake: Record<string, string[]> = vehicles.reduce(
  (acc, v) => {
    acc[v.make] = Array.from(new Set([...(acc[v.make] ?? []), v.model])).sort();
    return acc;
  },
  {} as Record<string, string[]>,
);

// Variants keyed by `${make}__${model}` so the quick-finder's Variant dropdown
// can narrow to a model's real trims.
export const variantsByMakeModel: Record<string, string[]> = vehicles.reduce(
  (acc, v) => {
    const key = `${v.make}__${v.model}`;
    acc[key] = Array.from(new Set([...(acc[key] ?? []), v.variant])).filter(Boolean).sort();
    return acc;
  },
  {} as Record<string, string[]>,
);

export const priceBounds = {
  min: Math.min(...vehicles.map((v) => v.price)),
  max: Math.max(...vehicles.map((v) => v.price)),
};
export const yearBounds = {
  min: Math.min(...vehicles.map((v) => v.year)),
  max: Math.max(...vehicles.map((v) => v.year)),
};
export const mileageMax = Math.max(...vehicles.map((v) => v.mileage));

/** Pre-computed filter taxonomy for the showroom (passed to the client). */
export const filterMeta = {
  makes: allMakes,
  modelsByMake,
  variantsByMakeModel,
  bodyTypes: allBodyTypes,
  driveTypes: allDriveTypes,
  fuels: allFuelTypes,
  transmissions: allTransmissions,
  priceBounds,
  yearBounds,
  mileageMax,
};
