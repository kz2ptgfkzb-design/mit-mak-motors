/**
 * Mit-Mak Motors — optional database setup helper.
 *
 * You usually do NOT need this: the app creates its tables and imports the
 * current inventory automatically on first use. Run this only if you want to
 * provision the schema and create the Super Admin up front.
 *
 *   1. Set the connection + admin vars (or run `vercel env pull .env.local`)
 *   2. node scripts/setup-db.mjs
 *
 * Env used: DATABASE_URL (or POSTGRES_URL), ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Tiny .env loader (no dependency) so `vercel env pull .env.local` just works.
for (const file of ['.env.local', '.env']) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error('✗ No DATABASE_URL / POSTGRES_URL set. Add it (or run `vercel env pull .env.local`) and retry.');
  process.exit(1);
}

const local = /localhost|127\.0\.0\.1/.test(url);
const sql = postgres(url, { prepare: false, ssl: local ? false : 'require', max: 1 });

async function main() {
  console.log('→ Applying schema...');
  const ddl = readFileSync(join(root, 'db', 'schema.sql'), 'utf8');
  await sql.unsafe(ddl);
  console.log('✓ Schema ready.');

  const email = (process.env.ADMIN_EMAIL || 'admin@mitmakmotors.co.za').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'MitMak@Admin2026';
  const name = process.env.ADMIN_NAME || 'Mit-Mak Admin';
  const hash = await bcrypt.hash(password, 10);

  const existing = await sql`SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1`;
  if (existing.length) {
    await sql`UPDATE users SET password_hash = ${hash}, role = 'super_admin', active = true, updated_at = now() WHERE lower(email) = ${email}`;
    console.log(`✓ Updated existing Super Admin: ${email}`);
  } else {
    const id = (globalThis.crypto?.randomUUID?.() ?? `u_${Date.now()}`);
    await sql`INSERT INTO users (id, email, name, role, password_hash, active) VALUES (${id}, ${email}, ${name}, 'super_admin', ${hash}, true)`;
    console.log(`✓ Created Super Admin: ${email}`);
  }

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM vehicles`;
  console.log(`\nVehicles in database: ${count}`);
  if (count === 0) {
    console.log('  (The app will import the current inventory automatically on first visit.)');
  }
  console.log('\n✓ Done. Sign in at /admin');
  if (!process.env.ADMIN_PASSWORD) {
    console.log('  ⚠  Using the default password. Set ADMIN_PASSWORD and re-run, or change it after signing in.');
  }
  await sql.end();
}

main().catch(async (e) => {
  console.error('✗ Setup failed:', e.message || e);
  await sql.end().catch(() => {});
  process.exit(1);
});
