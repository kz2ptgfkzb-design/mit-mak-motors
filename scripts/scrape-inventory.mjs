/**
 * Mit-Mak Motors — live inventory importer.
 *
 * Scrapes every /viewcar/ listing from mitmakmotors.co.za (Vehica plugin),
 * parses specs + the AutoTrader-hosted image gallery, and writes a typed
 * dataset to data/vehicles.json. Images map per-car by construction.
 *
 * Re-run any time to refresh stock:  node scripts/scrape-inventory.mjs
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'data', 'vehicles.json');

const BASE = 'https://www.mitmakmotors.co.za';
const SITEMAP = `${BASE}/vehica_car-sitemap.xml`;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const CONCURRENCY = 12;
const LOCATION_IDS = [
  'gerrit-maritz-flagship',
  'rachel-de-beer-premium',
  'gerrit-maritz-bakkie',
  'rachel-de-beer-trade',
  'gerrit-maritz-finance',
  'rachel-de-beer-delivery',
];

async function fetchText(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml' } });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return null;
}

function decodeEntities(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&hellip;/gi, '')
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&(?:rsquo|lsquo|#0?39);/gi, '’');
}
const stripTags = (s = '') => decodeEntities(String(s).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const toInt = (s = '') => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;

const DRIVE = { frontwheeldrive: 'FWD', rearwheeldrive: 'RWD', allwheeldrive: 'AWD', '4x4': '4x4', '4x2': 'RWD', awd: 'AWD', fwd: 'FWD', rwd: 'RWD' };
const TRANS = { automatic: 'Automatic', manual: 'Manual', auto: 'Automatic', tiptronic: 'Automatic', dsg: 'DCT', dct: 'DCT' };
const FUEL = { petrol: 'Petrol', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Electric' };
function mapBody(raw) {
  const s = (raw || '').toLowerCase().replace(/[^a-z]/g, '');
  if (s.includes('sportsutility') || s.includes('suv') || s.includes('crossover')) return 'SUV';
  if (s.includes('doublecab') || s.includes('crewcab')) return 'Double Cab';
  if (s.includes('singlecab')) return 'Single Cab';
  if (s.includes('extendedcab') || s.includes('supercab') || s.includes('clubcab')) return 'Extended Cab';
  if (s.includes('hatch')) return 'Hatchback';
  if (s.includes('convertible') || s.includes('cabriolet') || s.includes('roadster') || s.includes('spider')) return 'Cabriolet';
  if (s.includes('coupe')) return 'Coupe';
  if (s.includes('wagon') || s.includes('estate') || s.includes('tourer') || s.includes('sportback')) return 'Wagon';
  if (s.includes('mpv') || s.includes('peoplemover') || s.includes('minivan') || s.includes('kombi') || s.includes('bus')) return 'MPV';
  if (s.includes('panelvan') || s.includes('van')) return 'MPV';
  if (s.includes('bakkie') || s.includes('pickup')) return 'Double Cab';
  if (s.includes('sedan') || s.includes('saloon')) return 'Sedan';
  return 'Sedan';
}

function titleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSitemap() {
  return fetchText(SITEMAP).then((xml) => {
    if (!xml) throw new Error('Could not load sitemap');
    const out = [];
    const re = /<url>\s*<loc>([^<]*\/viewcar\/[^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g;
    let m;
    while ((m = re.exec(xml))) out.push({ url: m[1].trim(), lastmod: m[2] ? m[2].trim() : null });
    return out;
  });
}

function parseCar(html, url, lastmod) {
  // Attribute name/value pairs
  const attrs = {};
  const re = /vehica-car-attributes__name[^>]*>\s*([^<]+?)\s*:?\s*<\/div>\s*<div[^>]*vehica-car-attributes__values[^>]*>([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const key = stripTags(m[1]).replace(/:$/, '').trim();
    const val = stripTags(m[2]);
    if (key && val) attrs[key] = val;
  }

  const make = attrs['Make'] || '';
  const model = attrs['Model'] || '';
  if (!make || !model) return null;

  // Price — require class= (the bare ".vehica-car-price" also appears in scripts/CSS)
  const price =
    [...html.matchAll(/class="vehica-car-price[^"]*"[^>]*>\s*([\s\S]{0,40}?)<\/div>/g)]
      .map((x) => toInt(x[1]))
      .find((n) => n >= 1000) || 0;

  // Images (ordered, unique AutoTrader ids)
  const ids = [];
  const seen = new Set();
  const imgRe = /img\.autotrader\.co\.za\/(\d+)\//g;
  let im;
  while ((im = imgRe.exec(html))) {
    if (!seen.has(im[1])) {
      seen.add(im[1]);
      ids.push(im[1]);
    }
  }
  const images = ids.slice(0, 40).map((id) => `https://img.autotrader.co.za/${id}/Crop1024x576.jpg`);

  // Body type — from the ?type= filter link (full words, e.g. "sportsutilityvehicle")
  let bodyRaw = attrs['Body Type'] || attrs['Type'] || '';
  if (!bodyRaw) {
    const t = html.match(/\?type=([a-z0-9-]+)/i);
    bodyRaw = t ? t[1] : '';
  }
  const bodyType = mapBody(bodyRaw || `${model} ${variant}`);

  const driveRaw = (attrs['Drive Type'] || '').toLowerCase().replace(/\s+/g, '');
  const driveType = DRIVE[driveRaw] || 'FWD';
  const transRaw = (attrs['Transmission'] || '').toLowerCase();
  const transmission = TRANS[transRaw] || 'Automatic';
  const fuelRaw = (attrs['Fuel Type'] || attrs['Fuel'] || '').toLowerCase();
  const fuel = FUEL[fuelRaw] || 'Petrol';

  const year = toInt(attrs['Year']);
  const mileage = toInt(attrs['Mileage']);
  const variant = attrs['Variant'] || '';
  const color = titleCase((attrs['Color'] || attrs['Colour'] || '').toLowerCase()) || 'Unspecified';
  const stockNumber = attrs['Stock Number'] || attrs['Stock'] || '';
  const engineSize = attrs['Engine Size'] || '';
  let doors = toInt(attrs['Doors']);
  if (!doors) doors = bodyType === 'Coupe' || bodyType === 'Cabriolet' ? 2 : bodyType === 'Hatchback' ? 5 : 4;
  const seats = bodyType === 'Coupe' || bodyType === 'Cabriolet' ? 4 : 5;
  const condRaw = (attrs['Condition'] || 'Used').toLowerCase();
  const condition = condRaw.includes('new') ? 'New' : condRaw.includes('demo') ? 'Demo' : 'Used';

  // Features (bullet list in description)
  const feats = [];
  const fset = new Set();
  const fre = /•\s*([^•<\n]{2,70})/g;
  let fm;
  while ((fm = fre.exec(html))) {
    // Clean "read more" truncation artifacts (…, " />, [ ] etc.)
    let f = stripTags(fm[1])
      .replace(/\/>.*$/, '')
      .replace(/[[\]]/g, '')
      .replace(/["”]\s*$/, '')
      .replace(/[\s,;:.–—…-]+$/, '')
      .trim();
    if (f.length < 2) continue;
    f = titleCase(f.toLowerCase());
    if (!fset.has(f)) {
      fset.add(f);
      feats.push(f);
    }
  }
  const features = feats.slice(0, 18);

  const slug = url.replace(/\/$/, '').split('/viewcar/')[1];
  const name = `${year || ''} ${make} ${model} ${variant}`.replace(/\s+/g, ' ').trim();

  return {
    slug,
    make,
    model,
    variant,
    year: year || new Date().getFullYear(),
    price,
    bodyType,
    driveType,
    transmission,
    fuel,
    mileage,
    engineSize,
    doors,
    seats,
    color,
    condition,
    stockNumber,
    dateAdded: lastmod || null,
    images,
    name,
    features,
  };
}

async function pool(items, worker, concurrency) {
  const results = [];
  let i = 0;
  let done = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
      done++;
      if (done % 25 === 0) process.stdout.write(`  …${done}/${items.length}\n`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run));
  return results;
}

async function main() {
  console.log('→ Fetching sitemap…');
  const all = await getSitemap();
  const urls = process.env.MAX ? all.slice(0, Number(process.env.MAX)) : all;
  console.log(`→ ${all.length} vehicle URLs found. Scraping ${urls.length}…`);

  const raw = await pool(
    urls,
    async ({ url, lastmod }) => {
      const html = await fetchText(url);
      if (!html) return null;
      try {
        return parseCar(html, url, lastmod);
      } catch {
        return null;
      }
    },
    CONCURRENCY,
  );

  if (process.env.DEBUG) {
    const ok = raw.filter(Boolean);
    console.log('DEBUG parsed non-null:', ok.length, '/', raw.length);
    if (ok[0]) console.log('DEBUG sample:', JSON.stringify({ make: ok[0].make, model: ok[0].model, price: ok[0].price, imgs: ok[0].images.length, body: ok[0].bodyType }));
  }

  let cars = raw.filter((c) => c && c.price >= 10000 && c.images.length > 0);

  // De-dup slugs, assign location round-robin, sort by date desc
  const slugSeen = new Set();
  cars = cars.filter((c) => (slugSeen.has(c.slug) ? false : slugSeen.add(c.slug)));
  cars.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));

  const vehicles = cars.map((c, i) => ({
    id: c.slug, // unique; stock numbers can repeat across listings
    slug: c.slug,
    tagline: 'Inspected, reconditioned & delivered free.',
    make: c.make,
    model: c.model,
    variant: c.variant,
    year: c.year,
    price: c.price,
    bodyType: c.bodyType,
    driveType: c.driveType,
    transmission: c.transmission,
    fuel: c.fuel,
    mileage: c.mileage,
    engineSize: c.engineSize || '—',
    doors: c.doors,
    seats: c.seats,
    color: c.color,
    condition: c.condition,
    stockNumber: c.stockNumber || `MM-${1000 + i}`,
    dateAdded: (c.dateAdded || new Date().toISOString()).slice(0, 10),
    locationId: LOCATION_IDS[i % LOCATION_IDS.length],
    images: c.images,
    featured: false,
    description: `${c.name} finished in ${c.color}. ${c.mileage.toLocaleString('en-ZA')} km, ${c.transmission.toLowerCase()} ${c.fuel.toLowerCase()}${c.engineSize ? `, ${c.engineSize}` : ''}. Inspected and reconditioned by Mit-Mak Motors and delivered free anywhere in South Africa.`,
    highlights: (c.features.length ? c.features.slice(0, 4) : ['Inspected & reconditioned', 'Full report available', 'Delivered free nationwide', 'Warranty included']),
    features: c.features.length ? [{ category: 'Features & Specification', items: c.features }] : [],
    serviceHistory: 'Reconditioning report available on request. Inspected to the Mit-Mak 212-point standard.',
    warranty: '12-month Mit-Mak warranty (extendable up to 60 months)',
  }));

  // Feature a spread of desirable, well-photographed cars
  const desirable = /BMW|Mercedes|Audi|Porsche|Land Rover|Jaguar|Volkswagen|Toyota|Ford/i;
  let featured = 0;
  for (const v of vehicles) {
    if (featured >= 8) break;
    if (v.price >= 400000 && v.images.length >= 5 && desirable.test(v.make)) {
      v.featured = true;
      featured++;
    }
  }

  await writeFile(OUT, JSON.stringify(vehicles, null, 2));

  const by = (k) => [...new Set(vehicles.map((v) => v[k]))].sort();
  console.log(`\n✓ Wrote ${vehicles.length} vehicles → data/vehicles.json`);
  console.log(`  Makes (${by('make').length}): ${by('make').join(', ')}`);
  console.log(`  Body types: ${by('bodyType').join(', ')}`);
  console.log(`  Drive types: ${by('driveType').join(', ')}`);
  console.log(`  Fuel: ${by('fuel').join(', ')}`);
  console.log(`  Featured: ${vehicles.filter((v) => v.featured).length}`);
  console.log(`  Price range: R${Math.min(...vehicles.map((v) => v.price)).toLocaleString()} – R${Math.max(...vehicles.map((v) => v.price)).toLocaleString()}`);
  console.log(`  Avg images/car: ${(vehicles.reduce((s, v) => s + v.images.length, 0) / vehicles.length).toFixed(1)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
