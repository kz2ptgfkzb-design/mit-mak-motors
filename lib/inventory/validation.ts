import { z } from 'zod';

// Shared enums (kept in step with lib/inventory/types.ts).
export const zTransmission = z.enum(['Automatic', 'Manual', 'DCT', 'CVT']);
export const zFuel = z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']);
export const zBodyType = z.enum([
  'Sedan',
  'Coupe',
  'SUV',
  'Hatchback',
  'Cabriolet',
  'Single Cab',
  'Extended Cab',
  'Double Cab',
  'Wagon',
  'MPV',
]);
export const zDriveType = z.enum(['FWD', 'RWD', 'AWD', '4x4']);
export const zCondition = z.enum(['New', 'Demo', 'Used', 'Excellent', 'Very Good', 'Good']);
export const zStatus = z.enum(['available', 'reserved', 'sold', 'coming_soon', 'draft']);
export const zRole = z.enum(['super_admin', 'manager', 'sales', 'viewer']);
export const zLeadKind = z.enum(['general', 'finance', 'sell', 'test_drive', 'callback', 'contact']);
export const zLeadStatus = z.enum(['new', 'contacted', 'in_progress', 'closed', 'lost']);

// Bounded to Postgres `integer` range so oversized values never overflow the DB.
const optInt = z.coerce.number().int().min(-2_147_483_648).max(2_147_483_647).nullable().optional();
const optStr = z.string().trim().optional();

// Accept real JSON booleans (what the admin UI sends) and the strings
// "true"/"false". Avoids z.coerce.boolean(), which turns "false" into true.
const zBool = z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]);

// Only allow http(s) or site-relative URLs. Blocks javascript:, data:, blob:,
// file: (stored-XSS / SSRF vectors), since images render as raw <img>/next-image
// unoptimized and also flow into JSON-LD.
const zImageUrl = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine((u) => /^https?:\/\//i.test(u) || u.startsWith('/'), 'Image URL must start with http(s):// or /');

const zImage = z.object({
  url: zImageUrl,
  alt: z.string().trim().max(300).optional(),
});

const stringList = z
  .array(z.string().trim().max(200))
  .max(60)
  .optional()
  .transform((v) => (v ? v.filter(Boolean) : v));

// Fields shared by create + update. All optional here; create enforces make/model.
const vehicleBase = {
  slug: optStr,
  stockNumber: optStr,
  make: z.string().trim().min(1).max(80).optional(),
  model: z.string().trim().min(1).max(80).optional(),
  variant: z.string().trim().max(120).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  price: z.coerce.number().int().min(0).max(100_000_000).optional(),
  previousPrice: optInt,
  financeAvailable: zBool.optional(),
  monthlyRepayment: optInt,
  mileage: z.coerce.number().int().min(0).max(2_000_000).optional(),
  transmission: zTransmission.optional(),
  fuel: zFuel.optional(),
  bodyType: zBodyType.optional(),
  driveType: zDriveType.optional(),
  color: optStr,
  engineSize: optStr,
  power: z.string().trim().max(60).nullable().optional(),
  doors: z.coerce.number().int().min(0).max(10).optional(),
  seats: z.coerce.number().int().min(0).max(40).optional(),
  vin: z.string().trim().max(40).nullable().optional(),
  registrationYear: optInt,
  condition: zCondition.optional(),
  previousOwners: optInt,
  serviceHistory: z.string().trim().max(4000).optional(),
  warranty: z.string().trim().max(600).nullable().optional(),
  locationId: optStr,
  salesperson: z.string().trim().max(120).nullable().optional(),
  tagline: z.string().trim().max(300).optional(),
  shortDescription: z.string().trim().max(600).optional(),
  fullDescription: z.string().trim().max(8000).optional(),
  keyFeatures: stringList,
  safetyFeatures: stringList,
  comfortFeatures: stringList,
  images: z.array(zImage).max(40).optional(),
  status: zStatus.optional(),
  featured: zBool.optional(),
  showOnHomepage: zBool.optional(),
  dateAdded: z.string().trim().datetime().optional(),
};

export const vehicleCreateSchema = z
  .object(vehicleBase)
  .extend({
    make: z.string().trim().min(1, 'Make is required').max(80),
    model: z.string().trim().min(1, 'Model is required').max(80),
  });

export const vehiclePatchSchema = z.object(vehicleBase);

export const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  action: z.enum(['status', 'featured', 'homepage', 'delete', 'price']),
  status: zStatus.optional(),
  value: zBool.optional(),
  price: z.coerce.number().int().min(0).max(100_000_000).optional(),
});

export const leadCreateSchema = z.object({
  kind: zLeadKind.default('general'),
  name: z.string().trim().min(1, 'Name is required').max(160),
  phone: z.string().trim().max(40).default(''),
  email: z.string().trim().max(200).default(''),
  message: z.string().trim().max(4000).default(''),
  vehicleSlug: z.string().trim().max(120).nullable().optional(),
  vehicleTitle: z.string().trim().max(240).nullable().optional(),
  locationId: z.string().trim().max(120).nullable().optional(),
  meta: z.record(z.unknown()).optional(),
});

export const leadPatchSchema = z.object({
  status: zLeadStatus.optional(),
  addNote: z.object({ body: z.string().trim().min(1).max(2000) }).optional(),
});

export const userCreateSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().min(1).max(160),
  role: zRole,
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
});

export const userPatchSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  role: zRole.optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
});

export const settingsSchema = z.object({
  dealershipName: z.string().trim().max(160).optional(),
  hideSoldVehicles: z.boolean().optional(),
  notifyEmail: z.string().trim().max(200).optional(),
  branchEmails: z.record(z.string().trim().max(200)).optional(),
  currency: z.string().trim().max(8).optional(),
});

/** Flatten a ZodError into a single readable message. */
export function zodMessage(err: z.ZodError): string {
  return err.issues
    .map((i) => `${i.path.join('.') || 'field'}: ${i.message}`)
    .slice(0, 6)
    .join('; ');
}
