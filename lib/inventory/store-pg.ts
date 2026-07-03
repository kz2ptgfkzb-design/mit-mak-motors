import 'server-only';
import { getSql, type Sql } from '@/lib/db/client';
import { ensureSchema } from '@/lib/db/schema';
import type {
  InventoryVehicle,
  VehicleInput,
  Lead,
  LeadInput,
  LeadNote,
  AdminUser,
  SiteSettings,
} from './types';
import { DEFAULT_SETTINGS } from './types';
import { coerceVehicle } from './defaults';
import { seedVehicles } from './seed';
import type { InventoryStore, UserInput, UserPatch, LeadPatch } from './store';

// ── row <-> model helpers ─────────────────────────────────────

function iso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

/** Coerce to a valid Date, falling back to now for unparseable input (never throws). */
function toDate(v: unknown): Date {
  const d = v instanceof Date ? v : new Date(String(v ?? ''));
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function parseJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === 'object') return v as T; // some drivers hand back parsed values
  try {
    return JSON.parse(String(v)) as T;
  } catch {
    return fallback;
  }
}

function rowToVehicle(r: any): InventoryVehicle {
  return {
    id: r.id,
    slug: r.slug,
    stockNumber: r.stock_number ?? '',
    make: r.make,
    model: r.model,
    variant: r.variant ?? '',
    year: r.year,
    price: r.price,
    previousPrice: r.previous_price ?? null,
    financeAvailable: r.finance_available,
    monthlyRepayment: r.monthly_repayment ?? null,
    mileage: r.mileage,
    transmission: r.transmission,
    fuel: r.fuel,
    bodyType: r.body_type,
    driveType: r.drive_type,
    color: r.color ?? '',
    engineSize: r.engine_size ?? '',
    power: r.power ?? null,
    doors: r.doors,
    seats: r.seats,
    vin: r.vin ?? null,
    registrationYear: r.registration_year ?? null,
    condition: r.condition,
    previousOwners: r.previous_owners ?? null,
    serviceHistory: r.service_history ?? '',
    warranty: r.warranty ?? null,
    locationId: r.location_id ?? '',
    salesperson: r.salesperson ?? null,
    tagline: r.tagline ?? '',
    shortDescription: r.short_description ?? '',
    fullDescription: r.full_description ?? '',
    keyFeatures: parseJson<string[]>(r.key_features, []),
    safetyFeatures: parseJson<string[]>(r.safety_features, []),
    comfortFeatures: parseJson<string[]>(r.comfort_features, []),
    images: parseJson<InventoryVehicle['images']>(r.images, []),
    status: r.status,
    featured: r.featured,
    showOnHomepage: r.show_on_homepage,
    dateAdded: iso(r.date_added),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

function vehicleRow(v: InventoryVehicle): Record<string, unknown> {
  return {
    id: v.id,
    slug: v.slug,
    stock_number: v.stockNumber,
    make: v.make,
    model: v.model,
    variant: v.variant,
    year: v.year,
    price: v.price,
    previous_price: v.previousPrice,
    finance_available: v.financeAvailable,
    monthly_repayment: v.monthlyRepayment,
    mileage: v.mileage,
    transmission: v.transmission,
    fuel: v.fuel,
    body_type: v.bodyType,
    drive_type: v.driveType,
    color: v.color,
    engine_size: v.engineSize,
    power: v.power,
    doors: v.doors,
    seats: v.seats,
    vin: v.vin,
    registration_year: v.registrationYear,
    condition: v.condition,
    previous_owners: v.previousOwners,
    service_history: v.serviceHistory,
    warranty: v.warranty,
    location_id: v.locationId,
    salesperson: v.salesperson,
    tagline: v.tagline,
    short_description: v.shortDescription,
    full_description: v.fullDescription,
    key_features: JSON.stringify(v.keyFeatures ?? []),
    safety_features: JSON.stringify(v.safetyFeatures ?? []),
    comfort_features: JSON.stringify(v.comfortFeatures ?? []),
    images: JSON.stringify(v.images ?? []),
    status: v.status,
    featured: v.featured,
    show_on_homepage: v.showOnHomepage,
    date_added: toDate(v.dateAdded),
    created_at: toDate(v.createdAt),
    updated_at: toDate(v.updatedAt),
  };
}

const VEHICLE_COLS = [
  'id', 'slug', 'stock_number', 'make', 'model', 'variant', 'year', 'price', 'previous_price',
  'finance_available', 'monthly_repayment', 'mileage', 'transmission', 'fuel', 'body_type',
  'drive_type', 'color', 'engine_size', 'power', 'doors', 'seats', 'vin', 'registration_year',
  'condition', 'previous_owners', 'service_history', 'warranty', 'location_id', 'salesperson',
  'tagline', 'short_description', 'full_description', 'key_features', 'safety_features',
  'comfort_features', 'images', 'status', 'featured', 'show_on_homepage', 'date_added',
  'created_at', 'updated_at',
];
const VEHICLE_UPDATE_COLS = VEHICLE_COLS.filter((c) => c !== 'id' && c !== 'created_at');

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    kind: r.kind,
    name: r.name ?? '',
    phone: r.phone ?? '',
    email: r.email ?? '',
    message: r.message ?? '',
    vehicleSlug: r.vehicle_slug ?? null,
    vehicleTitle: r.vehicle_title ?? null,
    locationId: r.location_id ?? null,
    status: r.status,
    notes: parseJson<LeadNote[]>(r.notes, []),
    meta: parseJson<Record<string, unknown>>(r.meta, {}),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

function rowToUser(r: any): AdminUser {
  return {
    id: r.id,
    email: r.email,
    name: r.name ?? '',
    role: r.role,
    passwordHash: r.password_hash,
    active: r.active,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
    lastLoginAt: r.last_login_at ? iso(r.last_login_at) : null,
  };
}

// ── readiness (schema + one-time seed) ────────────────────────

const globalForReady = globalThis as unknown as { __mmPgReady?: Promise<void> };

async function seedIfEmpty(sql: Sql): Promise<void> {
  const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM vehicles`;
  if (count > 0) return;
  const rows = seedVehicles().map(vehicleRow);
  // One multi-row insert (~17k params, well under the 65k limit).
  await sql`INSERT INTO vehicles ${sql(rows)} ON CONFLICT (id) DO NOTHING`;
}

function ready(sql: Sql): Promise<void> {
  if (!globalForReady.__mmPgReady) {
    globalForReady.__mmPgReady = (async () => {
      await ensureSchema(sql);
      await seedIfEmpty(sql);
    })().catch((err) => {
      globalForReady.__mmPgReady = undefined;
      throw err;
    });
  }
  return globalForReady.__mmPgReady;
}

// ── store ─────────────────────────────────────────────────────

export class PgStore implements InventoryStore {
  readonly backend = 'postgres' as const;
  readonly persistent = true;

  private async sql(): Promise<Sql> {
    const sql = getSql();
    if (!sql) throw new Error('Postgres not configured');
    await ready(sql);
    return sql;
  }

  async listVehicles(): Promise<InventoryVehicle[]> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM vehicles ORDER BY date_added DESC, created_at DESC`;
    return rows.map(rowToVehicle);
  }

  async getVehicleById(id: string): Promise<InventoryVehicle | null> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM vehicles WHERE id = ${id} LIMIT 1`;
    return rows[0] ? rowToVehicle(rows[0]) : null;
  }

  async getVehicleBySlug(slug: string): Promise<InventoryVehicle | null> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM vehicles WHERE slug = ${slug} LIMIT 1`;
    return rows[0] ? rowToVehicle(rows[0]) : null;
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const sql = await this.sql();
    const rows = exceptId
      ? await sql`SELECT 1 FROM vehicles WHERE slug = ${slug} AND id <> ${exceptId} LIMIT 1`
      : await sql`SELECT 1 FROM vehicles WHERE slug = ${slug} LIMIT 1`;
    return rows.length > 0;
  }

  private async uniqueSlug(slug: string, exceptId?: string): Promise<string> {
    let candidate = slug;
    let n = 2;
    while (await this.slugExists(candidate, exceptId)) {
      candidate = `${slug}-${n++}`;
    }
    return candidate;
  }

  private async upsert(v: InventoryVehicle): Promise<InventoryVehicle> {
    const sql = await this.sql();
    const row = vehicleRow(v);
    await sql`
      INSERT INTO vehicles ${sql(row, ...VEHICLE_COLS)}
      ON CONFLICT (id) DO UPDATE SET ${sql(row, ...VEHICLE_UPDATE_COLS)}
    `;
    return v;
  }

  async createVehicle(input: VehicleInput): Promise<InventoryVehicle> {
    const v = coerceVehicle(input, null);
    v.slug = await this.uniqueSlug(v.slug, v.id);
    try {
      return await this.upsert(v);
    } catch (err) {
      // Concurrent create resolved to the same slug (unique_violation). Retry once
      // with a disambiguated slug rather than surfacing a 500.
      if ((err as { code?: string }).code === '23505') {
        v.slug = `${v.slug}-${v.id.slice(0, 6)}`;
        return this.upsert(v);
      }
      throw err;
    }
  }

  async updateVehicle(id: string, patch: VehicleInput): Promise<InventoryVehicle | null> {
    const existing = await this.getVehicleById(id);
    if (!existing) return null;
    const v = coerceVehicle(patch, existing);
    v.slug = await this.uniqueSlug(v.slug, id);
    return this.upsert(v);
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const sql = await this.sql();
    const rows = await sql`DELETE FROM vehicles WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }

  // Leads
  async listLeads(): Promise<Lead[]> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
    return rows.map(rowToLead);
  }

  async getLead(id: string): Promise<Lead | null> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
    return rows[0] ? rowToLead(rows[0]) : null;
  }

  async createLead(input: LeadInput): Promise<Lead> {
    const sql = await this.sql();
    const now = new Date();
    const lead: Lead = {
      id: globalThis.crypto.randomUUID(),
      kind: input.kind,
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message ?? '',
      vehicleSlug: input.vehicleSlug ?? null,
      vehicleTitle: input.vehicleTitle ?? null,
      locationId: input.locationId ?? null,
      status: 'new',
      notes: [],
      meta: input.meta ?? {},
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await sql`INSERT INTO leads (id, kind, name, phone, email, message, vehicle_slug, vehicle_title, location_id, status, notes, meta, created_at, updated_at)
      VALUES (${lead.id}, ${lead.kind}, ${lead.name}, ${lead.phone}, ${lead.email}, ${lead.message}, ${lead.vehicleSlug}, ${lead.vehicleTitle}, ${lead.locationId}, ${lead.status}, ${JSON.stringify(lead.notes)}, ${JSON.stringify(lead.meta)}, ${now}, ${now})`;
    return lead;
  }

  async updateLead(id: string, patch: LeadPatch): Promise<Lead | null> {
    const existing = await this.getLead(id);
    if (!existing) return null;
    const sql = await this.sql();
    const notes = [...existing.notes];
    if (patch.addNote && patch.addNote.body.trim()) {
      notes.push({
        id: globalThis.crypto.randomUUID(),
        author: patch.addNote.author,
        body: patch.addNote.body.trim(),
        createdAt: new Date().toISOString(),
      });
    }
    const status = patch.status ?? existing.status;
    const now = new Date();
    await sql`UPDATE leads SET status = ${status}, notes = ${JSON.stringify(notes)}, updated_at = ${now} WHERE id = ${id}`;
    return { ...existing, status, notes, updatedAt: now.toISOString() };
  }

  async deleteLead(id: string): Promise<boolean> {
    const sql = await this.sql();
    const rows = await sql`DELETE FROM leads WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }

  // Users
  async listUsers(): Promise<AdminUser[]> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM users ORDER BY created_at ASC`;
    return rows.map(rowToUser);
  }

  async countUsers(): Promise<number> {
    const sql = await this.sql();
    const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM users`;
    return count;
  }

  async getUserById(id: string): Promise<AdminUser | null> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async getUserByEmail(email: string): Promise<AdminUser | null> {
    const sql = await this.sql();
    const rows = await sql`SELECT * FROM users WHERE lower(email) = ${email.toLowerCase()} LIMIT 1`;
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async createUser(input: UserInput): Promise<AdminUser> {
    const sql = await this.sql();
    const now = new Date();
    const user: AdminUser = {
      id: globalThis.crypto.randomUUID(),
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      passwordHash: input.passwordHash,
      active: input.active ?? true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastLoginAt: null,
    };
    await sql`INSERT INTO users (id, email, name, role, password_hash, active, created_at, updated_at)
      VALUES (${user.id}, ${user.email}, ${user.name}, ${user.role}, ${user.passwordHash}, ${user.active}, ${now}, ${now})`;
    return user;
  }

  async updateUser(id: string, patch: UserPatch): Promise<AdminUser | null> {
    const existing = await this.getUserById(id);
    if (!existing) return null;
    const sql = await this.sql();
    const next: AdminUser = {
      ...existing,
      name: patch.name ?? existing.name,
      role: patch.role ?? existing.role,
      active: patch.active ?? existing.active,
      passwordHash: patch.passwordHash ?? existing.passwordHash,
      lastLoginAt: patch.lastLoginAt ?? existing.lastLoginAt,
      updatedAt: new Date().toISOString(),
    };
    await sql`UPDATE users SET
      name = ${next.name}, role = ${next.role}, active = ${next.active},
      password_hash = ${next.passwordHash}, last_login_at = ${next.lastLoginAt ? new Date(next.lastLoginAt) : null},
      updated_at = ${new Date(next.updatedAt)}
      WHERE id = ${id}`;
    return next;
  }

  async deleteUser(id: string): Promise<boolean> {
    const sql = await this.sql();
    const rows = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }

  // Reset tokens
  async createResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    const sql = await this.sql();
    await sql`DELETE FROM reset_tokens WHERE user_id = ${userId}`;
    await sql`INSERT INTO reset_tokens (token_hash, user_id, expires_at) VALUES (${tokenHash}, ${userId}, ${expiresAt})`;
  }

  async consumeResetToken(tokenHash: string): Promise<string | null> {
    const sql = await this.sql();
    const rows = await sql`DELETE FROM reset_tokens WHERE token_hash = ${tokenHash} AND expires_at > now() RETURNING user_id`;
    return rows[0]?.user_id ?? null;
  }

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const sql = await this.sql();
    const rows = await sql`SELECT data FROM settings WHERE id = 1 LIMIT 1`;
    if (!rows[0]) {
      const data = { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
      await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(data)}) ON CONFLICT (id) DO NOTHING`;
      return data;
    }
    return { ...DEFAULT_SETTINGS, ...parseJson<Partial<SiteSettings>>(rows[0].data, {}) };
  }

  async updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const sql = await this.sql();
    const current = await this.getSettings();
    const next: SiteSettings = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(next)})
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(next)}`;
    return next;
  }
}
