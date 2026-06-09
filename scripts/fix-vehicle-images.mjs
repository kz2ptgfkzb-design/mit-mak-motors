/**
 * One-off data repair: remove dealer banner / promo images that the inventory
 * scraper accidentally grabbed from every listing's page chrome and appended to
 * every car's gallery.
 *
 * Real car photos are unique to a single listing. The banner images, by
 * contrast, appear on ~all 401 cars (they're the "Dealer of the Year" /
 * promo graphics in the page, not photos of any specific vehicle). We detect
 * them by frequency: any image URL present on >= BANNER_THRESHOLD distinct
 * cars is a banner and is stripped from every car. The next-highest legitimate
 * share is 6 (identical brand-new units that genuinely share one stock-photo
 * set), so the threshold cleanly separates banners from real shared photos.
 *
 * Any listing left with zero real photos after stripping is dropped (a
 * photo-less listing can't be shown correctly).
 *
 * Run: node scripts/fix-vehicle-images.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'data', 'vehicles.json');
const BANNER_THRESHOLD = 50;

const data = JSON.parse(readFileSync(FILE, 'utf8'));

const count = {};
for (const v of data) for (const im of v.images || []) count[im] = (count[im] || 0) + 1;
const banners = new Set(
  Object.entries(count)
    .filter(([, n]) => n >= BANNER_THRESHOLD)
    .map(([u]) => u),
);

console.log(`Banner images (on >=${BANNER_THRESHOLD} cars), removing from every gallery:`);
for (const u of banners) console.log(`  ${String(count[u]).padStart(4)}x  ${u}`);

let stripped = 0;
const dropped = [];
const cleaned = [];
for (const v of data) {
  const before = v.images.length;
  v.images = v.images.filter((im) => !banners.has(im));
  stripped += before - v.images.length;
  if (v.images.length === 0) {
    dropped.push(`${v.year} ${v.make} ${v.model} ${v.variant} (${v.slug})`);
    continue;
  }
  cleaned.push(v);
}

console.log(`\nStripped ${stripped} banner entries.`);
console.log(`Dropped ${dropped.length} photo-less listing(s): ${dropped.join('; ') || 'none'}`);
console.log(`Inventory: ${data.length} -> ${cleaned.length} cars.`);

writeFileSync(FILE, JSON.stringify(cleaned, null, 2));
console.log('Wrote data/vehicles.json');
