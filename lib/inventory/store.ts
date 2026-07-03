import 'server-only';
import { isDbConfigured } from '@/lib/db/client';
import { PgStore } from './store-pg';
import { FileStore } from './store-file';
import type {
  InventoryVehicle,
  VehicleInput,
  Lead,
  LeadInput,
  LeadStatus,
  AdminUser,
  Role,
  SiteSettings,
} from './types';

export interface UserInput {
  /** Optional stable id (used to seed a deterministic demo admin across instances). */
  id?: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  active?: boolean;
}

export interface UserPatch {
  name?: string;
  role?: Role;
  active?: boolean;
  passwordHash?: string;
  lastLoginAt?: string;
}

export interface LeadPatch {
  status?: LeadStatus;
  addNote?: { author: string; body: string };
}

export interface InventoryStore {
  /** Which backend is active — surfaced in the admin UI. */
  readonly backend: 'postgres' | 'file';
  /** Whether writes persist reliably (false = file fallback on serverless). */
  readonly persistent: boolean;

  // Vehicles
  listVehicles(): Promise<InventoryVehicle[]>;
  getVehicleById(id: string): Promise<InventoryVehicle | null>;
  getVehicleBySlug(slug: string): Promise<InventoryVehicle | null>;
  createVehicle(input: VehicleInput): Promise<InventoryVehicle>;
  updateVehicle(id: string, patch: VehicleInput): Promise<InventoryVehicle | null>;
  deleteVehicle(id: string): Promise<boolean>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;

  // Leads
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createLead(input: LeadInput): Promise<Lead>;
  updateLead(id: string, patch: LeadPatch): Promise<Lead | null>;
  deleteLead(id: string): Promise<boolean>;

  // Users
  listUsers(): Promise<AdminUser[]>;
  getUserById(id: string): Promise<AdminUser | null>;
  getUserByEmail(email: string): Promise<AdminUser | null>;
  createUser(input: UserInput): Promise<AdminUser>;
  updateUser(id: string, patch: UserPatch): Promise<AdminUser | null>;
  deleteUser(id: string): Promise<boolean>;
  countUsers(): Promise<number>;

  // Password reset
  createResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  consumeResetToken(tokenHash: string): Promise<string | null>;

  // Settings
  getSettings(): Promise<SiteSettings>;
  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;
}

let cached: InventoryStore | undefined;

/** Resolve the active store: Postgres when configured, else the file fallback. */
export function getStore(): InventoryStore {
  if (cached) return cached;
  cached = isDbConfigured() ? new PgStore() : new FileStore();
  return cached;
}
