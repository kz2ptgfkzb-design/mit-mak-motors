-- Mit-Mak Motors — Inventory Management System schema (Postgres)
-- Idempotent. Kept in sync with lib/db/schema.ts (which runs automatically at
-- runtime). You normally do NOT need to run this by hand — the app creates the
-- tables and imports the current inventory on first use. Provided for reference
-- and for scripts/setup-db.mjs.

CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  stock_number text NOT NULL DEFAULT '',
  make text NOT NULL,
  model text NOT NULL,
  variant text NOT NULL DEFAULT '',
  year integer NOT NULL,
  price integer NOT NULL DEFAULT 0,
  previous_price integer,
  finance_available boolean NOT NULL DEFAULT true,
  monthly_repayment integer,
  mileage integer NOT NULL DEFAULT 0,
  transmission text NOT NULL DEFAULT 'Automatic',
  fuel text NOT NULL DEFAULT 'Petrol',
  body_type text NOT NULL DEFAULT 'Sedan',
  drive_type text NOT NULL DEFAULT 'FWD',
  color text NOT NULL DEFAULT '',
  engine_size text NOT NULL DEFAULT '',
  power text,
  doors integer NOT NULL DEFAULT 4,
  seats integer NOT NULL DEFAULT 5,
  vin text,
  registration_year integer,
  condition text NOT NULL DEFAULT 'Used',
  previous_owners integer,
  service_history text NOT NULL DEFAULT '',
  warranty text,
  location_id text NOT NULL DEFAULT '',
  salesperson text,
  tagline text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  key_features text NOT NULL DEFAULT '[]',
  safety_features text NOT NULL DEFAULT '[]',
  comfort_features text NOT NULL DEFAULT '[]',
  images text NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'available',
  featured boolean NOT NULL DEFAULT false,
  show_on_homepage boolean NOT NULL DEFAULT false,
  date_added timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vehicles_status_idx ON vehicles(status);
CREATE INDEX IF NOT EXISTS vehicles_make_idx ON vehicles(make);
CREATE INDEX IF NOT EXISTS vehicles_featured_idx ON vehicles(featured);
CREATE INDEX IF NOT EXISTS vehicles_date_added_idx ON vehicles(date_added DESC);

CREATE TABLE IF NOT EXISTS leads (
  id text PRIMARY KEY,
  kind text NOT NULL DEFAULT 'general',
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  vehicle_slug text,
  vehicle_title text,
  location_id text,
  status text NOT NULL DEFAULT 'new',
  notes text NOT NULL DEFAULT '[]',
  meta text NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'viewer',
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS reset_tokens (
  token_hash text PRIMARY KEY,
  user_id text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  data text NOT NULL,
  CONSTRAINT settings_singleton CHECK (id = 1)
);
