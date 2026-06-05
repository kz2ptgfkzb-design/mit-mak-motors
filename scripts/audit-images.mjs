// Audit every vehicle image URL for 404/dead links. Run: node scripts/audit-images.mjs
import fs from 'fs';
import https from 'https';

const v = JSON.parse(fs.readFileSync('data/vehicles.json', 'utf8'));
const urls = [...new Set(v.flatMap((x) => x.images || []))];

function check(url) {
  return new Promise((resolve) => {
    let done = false;
    const fin = (c) => { if (!done) { done = true; resolve(c); } };
    const req = https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' } }, (r) => {
      fin(r.statusCode);
      r.destroy();
    });
    req.on('error', () => fin(0));
    req.on('timeout', () => { req.destroy(); fin(-1); });
  });
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
  }));
  return out;
}

const codes = await pool(urls, 16, check);
const dist = codes.reduce((a, c) => { a[c] = (a[c] || 0) + 1; return a; }, {});
const broken = new Set(urls.filter((u, i) => codes[i] !== 200));
const affected = v.filter((x) => (x.images || []).some((u) => broken.has(u)));
const allBroken = v.filter((x) => (x.images || []).length > 0 && (x.images || []).every((u) => broken.has(u)));

fs.writeFileSync('/tmp/broken.json', JSON.stringify([...broken]));
console.log('uniqueURLs=' + urls.length, 'statusDist=' + JSON.stringify(dist));
console.log('brokenURLs=' + broken.size, 'vehiclesWith>=1broken=' + affected.length, 'vehiclesAllImagesBroken=' + allBroken.length);
console.log('sampleBroken=', [...broken].slice(0, 6));
if (allBroken.length) console.log('allBrokenSlugs=', allBroken.slice(0, 10).map((x) => x.slug));
