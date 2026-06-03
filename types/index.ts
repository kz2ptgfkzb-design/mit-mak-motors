// ─────────────────────────────────────────────────────────────
// Mit-Mak Motors — typed content model
// This is the single source of truth for inventory + taxonomy.
// Swap the JSON-like arrays in /data for a CMS feed and every page
// (showroom, filters, detail, compare, related) updates automatically.
// ─────────────────────────────────────────────────────────────

export type BodyType =
  | 'Sedan'
  | 'Coupe'
  | 'SUV'
  | 'Hatchback'
  | 'Cabriolet'
  | 'Single Cab'
  | 'Extended Cab'
  | 'Double Cab'
  | 'Wagon'
  | 'MPV';

export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4x4';

export type Transmission = 'Automatic' | 'Manual' | 'DCT' | 'CVT';

export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export type Condition = 'New' | 'Demo' | 'Used' | 'Excellent' | 'Very Good' | 'Good';

export interface FeatureGroup {
  category: string;
  items: string[];
}

export interface Vehicle {
  id: string;
  slug: string;
  /** Marketing line shown on cards + hero */
  tagline: string;

  // Identity
  make: string;
  model: string;
  variant: string;
  year: number;

  // Commercials
  price: number; // ZAR
  previousPrice?: number; // for "reduced" badges
  reserved?: boolean;
  sold?: boolean;
  featured?: boolean;

  // Core specs (the detail-page spec grid)
  bodyType: BodyType;
  driveType: DriveType;
  transmission: Transmission;
  fuel: FuelType;
  mileage: number; // km
  engineSize: string; // e.g. "2.0L Turbo"
  power?: string; // e.g. "135 kW"
  doors: number;
  seats: number;
  color: string;
  condition: Condition;
  stockNumber: string;
  vin?: string;

  // Meta
  dateAdded: string; // ISO — drives "Newest" sort
  locationId: string;

  // Media
  images: string[];

  // Narrative
  description: string;
  highlights: string[];
  features: FeatureGroup[];
  serviceHistory: string;
  warranty?: string;
}

export interface Location {
  id: string;
  name: string;
  kind: string;
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  lat: number;
  lng: number;
  flagship?: boolean;
}

export interface Award {
  id: string;
  title: string;
  subtitle: string;
  year?: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  external?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
  accent?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  body: string[];
}

export interface StaffMember {
  name: string;
  role: string;
  branch: string;
  image: string;
  bio: string;
}

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';

export interface VehicleFilters {
  q: string;
  make: string[];
  model: string[];
  bodyType: BodyType[];
  driveType: DriveType[];
  fuel: FuelType[];
  transmission: Transmission[];
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  maxMileage: number | null;
}
