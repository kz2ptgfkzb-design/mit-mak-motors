import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type {
  InventoryVehicle,
  VehicleInput,
  Lead,
  LeadInput,
  AdminUser,
  SiteSettings,
} from './types';
import { DEFAULT_SETTINGS } from './types';
import { coerceVehicle } from './defaults';
import { seedVehicles } from './seed';
import type { InventoryStore, UserInput, UserPatch, LeadPatch } from './store';

interface ResetTokenRow {
  tokenHash: string;
  userId: string;
  expiresAt: string;
}

interface Blob {
  vehicles: InventoryVehicle[];
  leads: Lead[];
  users: AdminUser[];
  resetTokens: ResetTokenRow[];
  settings: SiteSettings;
}

const ON_VERCEL = Boolean(process.env.VERCEL);
const STORE_PATH = ON_VERCEL
  ? path.join(os.tmpdir(), 'mm-admin-store.json')
  : path.join(process.cwd(), 'data', '.admin-store.json');

/**
 * File-backed fallback store used when no database is configured. Persists to
 * a local JSON file in dev (survives restarts) or to /tmp on Vercel (ephemeral,
 * demo only). Seeded from the scraped inventory so the admin has real stock.
 */
export class FileStore implements InventoryStore {
  readonly backend = 'file' as const;
  readonly persistent = !ON_VERCEL;

  private blob: Blob | null = null;
  private loading: Promise<Blob> | null = null;
  private writeChain: Promise<void> = Promise.resolve();

  private async load(): Promise<Blob> {
    if (this.blob) return this.blob;
    if (!this.loading) {
      this.loading = (async () => {
        try {
          const raw = await fs.readFile(STORE_PATH, 'utf8');
          const parsed = JSON.parse(raw) as Partial<Blob>;
          this.blob = {
            vehicles: parsed.vehicles ?? seedVehicles(),
            leads: parsed.leads ?? [],
            users: parsed.users ?? [],
            resetTokens: parsed.resetTokens ?? [],
            settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
          };
        } catch {
          this.blob = {
            vehicles: seedVehicles(),
            leads: [],
            users: [],
            resetTokens: [],
            settings: { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() },
          };
          await this.persist();
        }
        return this.blob;
      })();
    }
    return this.loading;
  }

  private async persist(): Promise<void> {
    const snapshot = this.blob;
    if (!snapshot) return;
    this.writeChain = this.writeChain.then(async () => {
      try {
        await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
        // Atomic write: serialise to a temp file, then rename over the target
        // (rename is atomic on POSIX) so a crash mid-write cannot corrupt the store.
        const tmp = `${STORE_PATH}.${process.pid}.tmp`;
        await fs.writeFile(tmp, JSON.stringify(snapshot, null, 2), 'utf8');
        await fs.rename(tmp, STORE_PATH);
      } catch (err) {
        console.error('[mit-mak] file store write failed:', err);
      }
    });
    return this.writeChain;
  }

  private uid(): string {
    return globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.round(Math.random() * 1e9)}`;
  }

  // Vehicles
  async listVehicles(): Promise<InventoryVehicle[]> {
    const b = await this.load();
    return [...b.vehicles].sort((a, z) => (a.dateAdded < z.dateAdded ? 1 : -1));
  }

  async getVehicleById(id: string): Promise<InventoryVehicle | null> {
    const b = await this.load();
    return b.vehicles.find((v) => v.id === id) ?? null;
  }

  async getVehicleBySlug(slug: string): Promise<InventoryVehicle | null> {
    const b = await this.load();
    return b.vehicles.find((v) => v.slug === slug) ?? null;
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const b = await this.load();
    return b.vehicles.some((v) => v.slug === slug && v.id !== exceptId);
  }

  private async uniqueSlug(slug: string, exceptId?: string): Promise<string> {
    let candidate = slug;
    let n = 2;
    while (await this.slugExists(candidate, exceptId)) candidate = `${slug}-${n++}`;
    return candidate;
  }

  async createVehicle(input: VehicleInput): Promise<InventoryVehicle> {
    const b = await this.load();
    const v = coerceVehicle(input, null);
    v.slug = await this.uniqueSlug(v.slug, v.id);
    b.vehicles.unshift(v);
    await this.persist();
    return v;
  }

  async updateVehicle(id: string, patch: VehicleInput): Promise<InventoryVehicle | null> {
    const b = await this.load();
    const idx = b.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const v = coerceVehicle(patch, b.vehicles[idx]);
    v.slug = await this.uniqueSlug(v.slug, id);
    b.vehicles[idx] = v;
    await this.persist();
    return v;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const b = await this.load();
    const before = b.vehicles.length;
    b.vehicles = b.vehicles.filter((v) => v.id !== id);
    if (b.vehicles.length === before) return false;
    await this.persist();
    return true;
  }

  // Leads
  async listLeads(): Promise<Lead[]> {
    const b = await this.load();
    return [...b.leads].sort((a, z) => (a.createdAt < z.createdAt ? 1 : -1));
  }

  async getLead(id: string): Promise<Lead | null> {
    const b = await this.load();
    return b.leads.find((l) => l.id === id) ?? null;
  }

  async createLead(input: LeadInput): Promise<Lead> {
    const b = await this.load();
    const now = new Date().toISOString();
    const lead: Lead = {
      id: this.uid(),
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
      createdAt: now,
      updatedAt: now,
    };
    b.leads.unshift(lead);
    await this.persist();
    return lead;
  }

  async updateLead(id: string, patch: LeadPatch): Promise<Lead | null> {
    const b = await this.load();
    const lead = b.leads.find((l) => l.id === id);
    if (!lead) return null;
    if (patch.status) lead.status = patch.status;
    if (patch.addNote && patch.addNote.body.trim()) {
      lead.notes.push({
        id: this.uid(),
        author: patch.addNote.author,
        body: patch.addNote.body.trim(),
        createdAt: new Date().toISOString(),
      });
    }
    lead.updatedAt = new Date().toISOString();
    await this.persist();
    return lead;
  }

  async deleteLead(id: string): Promise<boolean> {
    const b = await this.load();
    const before = b.leads.length;
    b.leads = b.leads.filter((l) => l.id !== id);
    if (b.leads.length === before) return false;
    await this.persist();
    return true;
  }

  // Users
  async listUsers(): Promise<AdminUser[]> {
    const b = await this.load();
    return [...b.users];
  }

  async countUsers(): Promise<number> {
    const b = await this.load();
    return b.users.length;
  }

  async getUserById(id: string): Promise<AdminUser | null> {
    const b = await this.load();
    return b.users.find((u) => u.id === id) ?? null;
  }

  async getUserByEmail(email: string): Promise<AdminUser | null> {
    const b = await this.load();
    return b.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async createUser(input: UserInput): Promise<AdminUser> {
    const b = await this.load();
    const now = new Date().toISOString();
    const user: AdminUser = {
      id: this.uid(),
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      passwordHash: input.passwordHash,
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };
    b.users.push(user);
    await this.persist();
    return user;
  }

  async updateUser(id: string, patch: UserPatch): Promise<AdminUser | null> {
    const b = await this.load();
    const user = b.users.find((u) => u.id === id);
    if (!user) return null;
    if (patch.name !== undefined) user.name = patch.name;
    if (patch.role !== undefined) user.role = patch.role;
    if (patch.active !== undefined) user.active = patch.active;
    if (patch.passwordHash !== undefined) user.passwordHash = patch.passwordHash;
    if (patch.lastLoginAt !== undefined) user.lastLoginAt = patch.lastLoginAt;
    user.updatedAt = new Date().toISOString();
    await this.persist();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const b = await this.load();
    const before = b.users.length;
    b.users = b.users.filter((u) => u.id !== id);
    if (b.users.length === before) return false;
    await this.persist();
    return true;
  }

  // Reset tokens
  async createResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    const b = await this.load();
    b.resetTokens = b.resetTokens.filter((t) => t.userId !== userId);
    b.resetTokens.push({ tokenHash, userId, expiresAt: expiresAt.toISOString() });
    await this.persist();
  }

  async consumeResetToken(tokenHash: string): Promise<string | null> {
    const b = await this.load();
    const row = b.resetTokens.find((t) => t.tokenHash === tokenHash);
    if (!row) return null;
    b.resetTokens = b.resetTokens.filter((t) => t.tokenHash !== tokenHash);
    await this.persist();
    if (new Date(row.expiresAt).getTime() < Date.now()) return null;
    return row.userId;
  }

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const b = await this.load();
    return b.settings;
  }

  async updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const b = await this.load();
    b.settings = { ...b.settings, ...patch, updatedAt: new Date().toISOString() };
    await this.persist();
    return b.settings;
  }
}
