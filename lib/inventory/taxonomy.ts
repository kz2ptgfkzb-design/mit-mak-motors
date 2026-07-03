// Derives the filter taxonomy (makes, models, variants, bounds, ...) from a
// live list of public vehicles, so the showroom filters always match real
// stock. Extracted from data/vehicles.ts so both the static seed and the
// store-backed public layer compute it identically.

import type { Vehicle, BodyType, DriveType, FuelType, Transmission } from '@/types';

export interface FilterMeta {
  makes: string[];
  modelsByMake: Record<string, string[]>;
  variantsByMakeModel: Record<string, string[]>;
  bodyTypes: BodyType[];
  driveTypes: DriveType[];
  fuels: FuelType[];
  transmissions: Transmission[];
  priceBounds: { min: number; max: number };
  yearBounds: { min: number; max: number };
  mileageMax: number;
}

export function computeFilterMeta(vehicles: Vehicle[]): FilterMeta {
  if (vehicles.length === 0) {
    return {
      makes: [],
      modelsByMake: {},
      variantsByMakeModel: {},
      bodyTypes: [],
      driveTypes: [],
      fuels: [],
      transmissions: [],
      priceBounds: { min: 0, max: 0 },
      yearBounds: { min: 0, max: 0 },
      mileageMax: 0,
    };
  }

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType))) as BodyType[];
  const driveTypes = Array.from(new Set(vehicles.map((v) => v.driveType))) as DriveType[];
  const fuels = Array.from(new Set(vehicles.map((v) => v.fuel))) as FuelType[];
  const transmissions = Array.from(new Set(vehicles.map((v) => v.transmission))) as Transmission[];

  const modelsByMake = vehicles.reduce<Record<string, string[]>>((acc, v) => {
    acc[v.make] = Array.from(new Set([...(acc[v.make] ?? []), v.model])).sort();
    return acc;
  }, {});

  const variantsByMakeModel = vehicles.reduce<Record<string, string[]>>((acc, v) => {
    const key = `${v.make}__${v.model}`;
    acc[key] = Array.from(new Set([...(acc[key] ?? []), v.variant])).filter(Boolean).sort();
    return acc;
  }, {});

  return {
    makes,
    modelsByMake,
    variantsByMakeModel,
    bodyTypes,
    driveTypes,
    fuels,
    transmissions,
    priceBounds: {
      min: Math.min(...vehicles.map((v) => v.price)),
      max: Math.max(...vehicles.map((v) => v.price)),
    },
    yearBounds: {
      min: Math.min(...vehicles.map((v) => v.year)),
      max: Math.max(...vehicles.map((v) => v.year)),
    },
    mileageMax: Math.max(...vehicles.map((v) => v.mileage)),
  };
}
