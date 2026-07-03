import type { InventoryVehicle, VehicleInput, VehicleImage } from './types';
import { normalizeText } from './mappers';

export function slugify(input: string): string {
  return normalizeText(input)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normImages(images: VehicleImage[] | undefined): VehicleImage[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter((i) => i && typeof i.url === 'string' && i.url.trim())
    .map((i) => ({ url: i.url.trim(), alt: i.alt ? normalizeText(i.alt) : undefined }));
}

function normList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.map((x) => normalizeText(String(x))).filter(Boolean);
}

const BLANK: InventoryVehicle = {
  id: '',
  slug: '',
  stockNumber: '',
  make: '',
  model: '',
  variant: '',
  year: new Date().getFullYear(),
  price: 0,
  previousPrice: null,
  financeAvailable: true,
  monthlyRepayment: null,
  mileage: 0,
  transmission: 'Automatic',
  fuel: 'Petrol',
  bodyType: 'Sedan',
  driveType: 'FWD',
  color: '',
  engineSize: '',
  power: null,
  doors: 4,
  seats: 5,
  vin: null,
  registrationYear: null,
  condition: 'Used',
  previousOwners: null,
  serviceHistory: '',
  warranty: null,
  locationId: '',
  salesperson: null,
  tagline: 'Inspected, reconditioned & delivered free.',
  shortDescription: '',
  fullDescription: '',
  keyFeatures: [],
  safetyFeatures: [],
  comfortFeatures: [],
  images: [],
  status: 'draft',
  featured: false,
  showOnHomepage: false,
  dateAdded: '',
  createdAt: '',
  updatedAt: '',
};

/**
 * Produce a complete, normalised InventoryVehicle from a (validated) partial
 * input, layering onto an existing record for updates. Text fields are run
 * through normalizeText (strips em/en dashes per house style).
 */
export function coerceVehicle(input: VehicleInput, existing: InventoryVehicle | null): InventoryVehicle {
  const now = new Date().toISOString();
  const base = existing ?? { ...BLANK, id: cryptoId(), createdAt: now, dateAdded: now };

  const merged: InventoryVehicle = { ...base };

  const setStr = (k: keyof InventoryVehicle, v: string | undefined) => {
    if (v !== undefined) (merged as unknown as Record<string, unknown>)[k] = normalizeText(v);
  };
  const setRaw = <K extends keyof InventoryVehicle>(k: K, v: InventoryVehicle[K] | undefined) => {
    if (v !== undefined) merged[k] = v;
  };

  setStr('make', input.make);
  setStr('model', input.model);
  setStr('variant', input.variant);
  setStr('stockNumber', input.stockNumber);
  setStr('color', input.color);
  setStr('engineSize', input.engineSize);
  setStr('serviceHistory', input.serviceHistory);
  setStr('tagline', input.tagline);
  setStr('shortDescription', input.shortDescription);
  setStr('fullDescription', input.fullDescription);
  setStr('locationId', input.locationId);

  if (input.power !== undefined) merged.power = input.power ? normalizeText(input.power) : null;
  if (input.warranty !== undefined) merged.warranty = input.warranty ? normalizeText(input.warranty) : null;
  if (input.vin !== undefined) merged.vin = input.vin ? normalizeText(input.vin).toUpperCase() : null;
  if (input.salesperson !== undefined) merged.salesperson = input.salesperson ? normalizeText(input.salesperson) : null;

  setRaw('year', input.year);
  setRaw('price', input.price);
  setRaw('mileage', input.mileage);
  setRaw('doors', input.doors);
  setRaw('seats', input.seats);
  setRaw('transmission', input.transmission);
  setRaw('fuel', input.fuel);
  setRaw('bodyType', input.bodyType);
  setRaw('driveType', input.driveType);
  setRaw('condition', input.condition);
  setRaw('status', input.status);
  setRaw('financeAvailable', input.financeAvailable);
  setRaw('featured', input.featured);
  setRaw('showOnHomepage', input.showOnHomepage);

  // Use `!== undefined` (not `??`) so an explicit null clears the field.
  if (input.previousPrice !== undefined) merged.previousPrice = input.previousPrice;
  if (input.monthlyRepayment !== undefined) merged.monthlyRepayment = input.monthlyRepayment;
  if (input.registrationYear !== undefined) merged.registrationYear = input.registrationYear;
  if (input.previousOwners !== undefined) merged.previousOwners = input.previousOwners;

  if (input.keyFeatures !== undefined) merged.keyFeatures = normList(input.keyFeatures);
  if (input.safetyFeatures !== undefined) merged.safetyFeatures = normList(input.safetyFeatures);
  if (input.comfortFeatures !== undefined) merged.comfortFeatures = normList(input.comfortFeatures);
  if (input.images !== undefined) merged.images = normImages(input.images);

  if (input.slug !== undefined && input.slug) merged.slug = slugify(input.slug);
  if (input.dateAdded !== undefined && input.dateAdded) merged.dateAdded = input.dateAdded;

  // Derive a slug on first save if none supplied.
  if (!merged.slug) {
    merged.slug = slugify(`${merged.year} ${merged.make} ${merged.model} ${merged.variant}`) || `vehicle-${merged.id.slice(0, 8)}`;
  }
  if (!merged.stockNumber) merged.stockNumber = `MM-${merged.id.slice(0, 6).toUpperCase()}`;
  if (!merged.tagline) merged.tagline = 'Inspected, reconditioned & delivered free.';

  merged.updatedAt = now;
  return merged;
}

function cryptoId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `v_${Math.abs(hashStr(String(process.hrtime.bigint())))}`;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
