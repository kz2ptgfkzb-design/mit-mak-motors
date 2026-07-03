import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Vehicle } from '@/types';
import type { InventoryVehicle } from './types';
import { getStore } from './store';
import { seedVehicles } from './seed';
import { toPublicVehicle, toPublicCard } from './mappers';
import { computeFilterMeta, type FilterMeta } from './taxonomy';

export const VEHICLES_TAG = 'vehicles';

function seedPublished(): InventoryVehicle[] {
  return seedVehicles().filter((v) => v.status !== 'draft');
}

/**
 * The live published inventory (admin records). Falls back to the scraped seed
 * whenever the store is unconfigured, empty, or unreachable — the public site
 * must never render an empty showroom.
 */
async function loadPublishedRaw(): Promise<InventoryVehicle[]> {
  try {
    const store = getStore();
    const [all, settings] = await Promise.all([store.listVehicles(), store.getSettings()]);
    // Seed fallback only when the store is genuinely empty (unconfigured, or a
    // database that has not been seeded yet) so the site is never blank on a
    // fresh setup. If the store HAS vehicles but they are all draft/sold, that
    // is the dealer's real published state - show it (even if empty), never the
    // seed catalog.
    if (all.length === 0) return seedPublished();
    let pub = all.filter((v) => v.status !== 'draft');
    if (settings.hideSoldVehicles) pub = pub.filter((v) => v.status !== 'sold');
    return pub;
  } catch (err) {
    console.error('[mit-mak] inventory read failed, using seed fallback:', err);
    return seedPublished();
  }
}

// Cache published reads; busted via revalidateTag(VEHICLES_TAG) on admin writes.
const cachedPublished = unstable_cache(loadPublishedRaw, ['mm-published-inventory'], {
  tags: [VEHICLES_TAG],
  revalidate: 300,
});

async function published(): Promise<InventoryVehicle[]> {
  return cachedPublished();
}

export async function getPublishedVehicles(): Promise<Vehicle[]> {
  return (await published()).map(toPublicVehicle);
}

export async function getPublishedCards(): Promise<Vehicle[]> {
  return (await published()).map(toPublicCard);
}

export async function getPublishedVehicle(slug: string): Promise<Vehicle | null> {
  const inv = (await published()).find((v) => v.slug === slug);
  return inv ? toPublicVehicle(inv) : null;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  return (await published()).map((v) => v.slug);
}

export async function getFeaturedCards(): Promise<Vehicle[]> {
  return (await published())
    .filter((v) => v.featured && v.status !== 'sold')
    .map(toPublicCard);
}

/** Cars flagged for the homepage (falls back to featured, then newest few). */
export async function getHomepageCards(limit = 8): Promise<Vehicle[]> {
  const all = await published();
  let list = all.filter((v) => v.showOnHomepage && v.status !== 'sold');
  if (list.length === 0) list = all.filter((v) => v.featured && v.status !== 'sold');
  if (list.length === 0) list = all.filter((v) => v.status === 'available').slice(0, limit);
  return list.slice(0, limit).map(toPublicCard);
}

export async function getFilterMeta(): Promise<FilterMeta> {
  return computeFilterMeta(await getPublishedCards());
}

export async function getHeroVehicle(): Promise<Vehicle> {
  const all = await published();
  const pick =
    all.find((v) => v.slug === '2015-bmw-m4-coupe-auto') ??
    all.find((v) => /bmw/i.test(v.make) && /m4/i.test(`${v.model} ${v.variant}`)) ??
    [...all].sort((a, b) => b.price - a.price).find((v) => v.images.length >= 6) ??
    all[0];
  return pick ? toPublicVehicle(pick) : toPublicVehicle(seedPublished()[0]);
}

export async function getRelatedCards(vehicle: Vehicle, limit = 4): Promise<Vehicle[]> {
  const all = await published();
  return all
    .filter((v) => v.slug !== vehicle.slug && v.status !== 'sold' && v.status !== 'draft')
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
    .map((x) => toPublicCard(x.v));
}
