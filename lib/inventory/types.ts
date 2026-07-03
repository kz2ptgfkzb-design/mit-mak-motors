// ─────────────────────────────────────────────────────────────
// Mit-Mak Motors — Inventory Management System, canonical model
//
// This is the single source of truth for the ADMIN side of the
// business (vehicles, leads, users, settings). It is a superset of
// the public `Vehicle` type in /types and maps onto it via
// `toPublicVehicle` (see ./mappers). Every field the dealership can
// edit in the admin dashboard lives here.
// ─────────────────────────────────────────────────────────────

import type { BodyType, DriveType, FuelType, Transmission, Condition } from '@/types';

export type { BodyType, DriveType, FuelType, Transmission, Condition };

/** Lifecycle of a listing. `draft` is never shown publicly. */
export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'coming_soon' | 'draft';

export const VEHICLE_STATUSES: VehicleStatus[] = [
  'available',
  'reserved',
  'sold',
  'coming_soon',
  'draft',
];

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  coming_soon: 'Coming Soon',
  draft: 'Draft / Hidden',
};

/** A published listing is anything the public may see (everything except draft). */
export function isPublished(status: VehicleStatus): boolean {
  return status !== 'draft';
}

export interface VehicleImage {
  url: string;
  /** Alt text for SEO + accessibility. Optional; falls back to the vehicle title. */
  alt?: string;
}

export interface InventoryVehicle {
  /** Stable primary key (uuid in Postgres, slug-derived in the file fallback). */
  id: string;
  /** SEO-friendly URL segment, unique across the inventory. */
  slug: string;
  /** Dealer stock number (may repeat across historical listings). */
  stockNumber: string;

  // Identity
  make: string;
  model: string;
  variant: string;
  year: number;

  // Commercials
  price: number; // ZAR
  previousPrice: number | null; // drives a "reduced" badge
  financeAvailable: boolean;
  monthlyRepayment: number | null; // optional estimate

  // Core specs
  mileage: number; // km
  transmission: Transmission;
  fuel: FuelType;
  bodyType: BodyType;
  driveType: DriveType;
  color: string;
  engineSize: string;
  power: string | null;
  doors: number;
  seats: number;
  vin: string | null;
  registrationYear: number | null;
  condition: Condition;
  previousOwners: number | null;

  // Provenance
  serviceHistory: string;
  warranty: string | null;

  // Placement
  locationId: string;
  salesperson: string | null;

  // Copy
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  safetyFeatures: string[];
  comfortFeatures: string[];

  // Media — ordered; images[0] is the main/hero image.
  images: VehicleImage[];

  // Merchandising
  status: VehicleStatus;
  featured: boolean;
  showOnHomepage: boolean;

  // Timestamps (ISO strings)
  dateAdded: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fields accepted when creating or updating a vehicle (server fills the rest).
 * Fully partial at the type level; the create API route enforces make/model via
 * zod at the request boundary.
 */
export type VehicleInput = Partial<Omit<InventoryVehicle, 'id' | 'createdAt' | 'updatedAt'>>;

// ── Leads / enquiries ─────────────────────────────────────────

export type LeadKind = 'general' | 'finance' | 'sell' | 'test_drive' | 'callback' | 'contact';

export const LEAD_KIND_LABELS: Record<LeadKind, string> = {
  general: 'Vehicle enquiry',
  finance: 'Finance enquiry',
  sell: 'Sell your car',
  test_drive: 'Test drive',
  callback: 'Callback request',
  contact: 'General contact',
};

export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed' | 'lost';

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'in_progress', 'closed', 'lost'];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In progress',
  closed: 'Closed',
  lost: 'Lost',
};

export interface LeadNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  kind: LeadKind;
  name: string;
  phone: string;
  email: string;
  message: string;
  vehicleSlug: string | null;
  vehicleTitle: string | null;
  locationId: string | null;
  status: LeadStatus;
  notes: LeadNote[];
  /** Extra structured fields captured by a specific form (finance term, trade-in, etc.). */
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type LeadInput = {
  kind: LeadKind;
  name: string;
  phone: string;
  email: string;
  message?: string;
  vehicleSlug?: string | null;
  vehicleTitle?: string | null;
  locationId?: string | null;
  meta?: Record<string, unknown>;
};

// ── Users / RBAC ──────────────────────────────────────────────

export type Role = 'super_admin' | 'manager' | 'sales' | 'viewer';

export const ROLES: Role[] = ['super_admin', 'manager', 'sales', 'viewer'];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  sales: 'Sales Staff',
  viewer: 'Viewer',
};

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string; // never leaves the server
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

/** Everything about a user EXCEPT the password hash — safe to send to a client. */
export type SafeUser = Omit<AdminUser, 'passwordHash'>;

export function toSafeUser(u: AdminUser): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = u;
  return safe;
}

// ── Settings ──────────────────────────────────────────────────

export interface SiteSettings {
  dealershipName: string;
  /** If true, sold vehicles are hidden from the public site entirely. If false, they show with a "Sold" badge. */
  hideSoldVehicles: boolean;
  /** Global address that new-enquiry notifications are sent to. */
  notifyEmail: string;
  /** Per-branch notification override, keyed by locationId. */
  branchEmails: Record<string, string>;
  currency: string;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  dealershipName: 'Mit-Mak Motors',
  hideSoldVehicles: false,
  notifyEmail: '',
  branchEmails: {},
  currency: 'ZAR',
  updatedAt: '1970-01-01T00:00:00.000Z',
};
