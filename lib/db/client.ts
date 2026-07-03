import 'server-only';
import postgres from 'postgres';

// Single Postgres connection factory. Returns null when no connection string
// is configured, which is the signal for the inventory store to fall back to
// its file/seed backend (keyless-first: the site runs with zero setup).

export type Sql = ReturnType<typeof postgres>;

function connectionString(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''
  );
}

export function isDbConfigured(): boolean {
  return Boolean(connectionString());
}

// Cache across hot-reloads / warm lambdas.
const globalForDb = globalThis as unknown as { __mmSql?: Sql | null };

export function getSql(): Sql | null {
  if (globalForDb.__mmSql !== undefined) return globalForDb.__mmSql;

  const url = connectionString();
  if (!url) {
    globalForDb.__mmSql = null;
    return null;
  }

  const local = /localhost|127\.0\.0\.1/.test(url);
  globalForDb.__mmSql = postgres(url, {
    // Neon / Vercel Postgres pooled endpoints run pgbouncer in transaction
    // mode, which is incompatible with prepared statements.
    prepare: false,
    ssl: local ? false : 'require',
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
    onnotice: () => {},
  });
  return globalForDb.__mmSql;
}
