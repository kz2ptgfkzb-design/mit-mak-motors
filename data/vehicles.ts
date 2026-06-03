import type { Vehicle } from '@/types';
import { rotate } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// SAMPLE INVENTORY — 12 vehicles.
// Images are premium stock placeholders. To go live, replace each
// vehicle's `images` array with real photo URLs (or point this file
// at your CMS / DMS feed). The shape is all that matters downstream.
// ─────────────────────────────────────────────────────────────

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const EXTERIORS = [
  '1503376780353-7e6692767b70',
  '1552519507-da3b142c6e3d',
  '1542362567-b07e54358753',
  '1511919884226-fd3cad34687c',
  '1617469767053-d3b523a0b982',
  '1492144534655-ae79c964c9d7',
  '1605559424843-9e4c228bf1c2',
  '1503736334956-4c8f8e92946d',
  '1541899481282-d53bffe3c35d',
  '1502161254066-6c74afbf07aa',
  '1544636331-e26879cd4d9b',
  '1619767886558-efdc259cde1a',
  '1580414057403-c5f451f30e1c',
  '1494905998402-395d579af36f',
];

const INTERIORS = [
  '1502877338535-766e1452684a',
  '1449965408869-eaa3f722e40d',
  '1493238792000-8113da705763',
  '1485463611174-f302f6a5c1c9',
  '1493134799591-2c9eed26201a',
  '1471444928139-48c5bf5173f8',
  '1553440569-bcc63803a83d',
];

/** Build an 11-image gallery: hero + rotating exteriors + interiors. */
function gallery(hero: string, offset: number): string[] {
  const ext = rotate(EXTERIORS, offset).slice(0, 6);
  const int = rotate(INTERIORS, offset).slice(0, 4);
  return [hero, ...ext, ...int].map((id) => img(id));
}

const germanLuxFeatures = (extra: string[] = []) => [
  {
    category: 'Comfort & Convenience',
    items: [
      'Dual-zone climate control',
      'Heated leather seats',
      'Electric, memory front seats',
      'Keyless entry & start',
      'Auto-dimming mirrors',
      ...extra,
    ],
  },
  {
    category: 'Safety & Driver Assist',
    items: [
      'Adaptive cruise control',
      'Lane-keep assist',
      'Blind-spot monitoring',
      'Front & rear park distance control',
      '360° / reverse camera',
    ],
  },
  {
    category: 'Infotainment & Tech',
    items: [
      'Digital instrument cluster',
      'Apple CarPlay & Android Auto',
      'Wireless charging',
      'Premium sound system',
      'Navigation',
    ],
  },
];

export const vehicles: Vehicle[] = [
  {
    id: 'mm-2401',
    slug: 'bmw-320i-m-sport-2022',
    tagline: 'The benchmark sports sedan, sharpened.',
    make: 'BMW',
    model: '3 Series',
    variant: '320i M Sport',
    year: 2022,
    price: 549900,
    bodyType: 'Sedan',
    driveType: 'RWD',
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: 38500,
    engineSize: '2.0L Turbo',
    power: '135 kW',
    doors: 4,
    seats: 5,
    color: 'Alpine White',
    condition: 'Excellent',
    stockNumber: 'MM-2401',
    vin: 'WBA5R12090FH00001',
    dateAdded: '2026-05-24',
    locationId: 'gerrit-maritz-flagship',
    featured: true,
    images: gallery('1555215695-3004980ad54e', 0),
    description:
      'A one-owner 320i M Sport with full BMW service history and the desirable M Sport package. Rear-wheel-drive poise, a punchy 2.0-litre turbo, and a cabin that still feels current. Reconditioned and delivery-ready.',
    highlights: [
      'Full BMW service history',
      'M Sport package & 19" alloys',
      'Live Cockpit Professional',
      'One owner from new',
    ],
    features: germanLuxFeatures(['M Sport multifunction steering wheel', 'Sport seats']),
    serviceHistory: 'Full BMW franchise history, last serviced at 36,000 km. Motorplan to 2027 / 100,000 km.',
    warranty: 'Balance of BMW Motorplan + 12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2402',
    slug: 'mercedes-benz-c200-cabriolet-2021',
    tagline: 'Top down, heads up.',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    variant: 'C200 Cabriolet AMG Line',
    year: 2021,
    price: 689900,
    bodyType: 'Cabriolet',
    driveType: 'RWD',
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: 31200,
    engineSize: '1.5L Turbo + EQ Boost',
    power: '150 kW',
    doors: 2,
    seats: 4,
    color: 'Obsidian Black',
    condition: 'Excellent',
    stockNumber: 'MM-2402',
    vin: 'WDD2054092F000002',
    dateAdded: '2026-05-18',
    locationId: 'rachel-de-beer-premium',
    images: gallery('1583267746897-2cf415887172', 2),
    description:
      'A stunning C200 Cabriolet in AMG Line trim with the clever AIRCAP and AIRSCARF system for top-down comfort all year. Low mileage, immaculate, and endlessly photogenic.',
    highlights: [
      'AMG Line exterior & interior',
      'AIRSCARF neck-level heating',
      'Burmester surround sound',
      'Acoustic soft-top roof',
    ],
    features: germanLuxFeatures(['AIRSCARF & AIRCAP', 'Ambient lighting (64 colour)']),
    serviceHistory: 'Full Mercedes-Benz history. Service plan to 2026 / 100,000 km.',
    warranty: '12-month Mit-Mak warranty (extendable to 60 months)',
  },
  {
    id: 'mm-2403',
    slug: 'audi-a4-40-tfsi-s-line-2021',
    tagline: 'Quietly brilliant. Loudly capable.',
    make: 'Audi',
    model: 'A4',
    variant: '40 TFSI S line',
    year: 2021,
    price: 519900,
    bodyType: 'Sedan',
    driveType: 'FWD',
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: 52000,
    engineSize: '2.0L TFSI',
    power: '140 kW',
    doors: 4,
    seats: 5,
    color: 'Daytona Grey',
    condition: 'Very Good',
    stockNumber: 'MM-2403',
    vin: 'WAUZZZF40MA000003',
    dateAdded: '2026-04-30',
    locationId: 'gerrit-maritz-flagship',
    images: gallery('1606152421802-db97b9c7a11b', 4),
    description:
      'The A4 40 TFSI in sporty S line trim, with Audi’s Virtual Cockpit and that famously solid cabin. A refined, efficient executive sedan that has been meticulously maintained.',
    highlights: [
      'S line package',
      'Virtual Cockpit Plus',
      'Matrix LED headlights',
      'Full service history',
    ],
    features: germanLuxFeatures(['S line sport seats', 'Three-zone climate']),
    serviceHistory: 'Full Audi history, last serviced at 48,000 km.',
    warranty: '12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2404',
    slug: 'volkswagen-golf-8-gti-2022',
    tagline: 'The hot hatch that started it all — Mk8 sharp.',
    make: 'Volkswagen',
    model: 'Golf',
    variant: '8 GTI 2.0 TSI DSG',
    year: 2022,
    price: 579900,
    bodyType: 'Hatchback',
    driveType: 'FWD',
    transmission: 'DCT',
    fuel: 'Petrol',
    mileage: 24800,
    engineSize: '2.0L TSI',
    power: '180 kW',
    doors: 5,
    seats: 5,
    color: 'Kings Red',
    condition: 'Excellent',
    stockNumber: 'MM-2404',
    vin: 'WVWZZZCD0NW000004',
    dateAdded: '2026-05-27',
    locationId: 'gerrit-maritz-flagship',
    featured: true,
    images: gallery('1606611013016-969c19ba27bb', 6),
    description:
      'A low-mileage Golf 8 GTI with the full digital cockpit, IQ.Light LED matrix headlights and the iconic tartan-inspired sport seats. Quick, planted and surprisingly practical.',
    highlights: [
      'Just 24,800 km',
      'IQ.Light LED Matrix',
      'Harman Kardon sound',
      'DCC adaptive chassis',
    ],
    features: germanLuxFeatures(['GTI sport seats', 'Progressive steering', 'Drive mode select']),
    serviceHistory: 'Full VW history. Service plan to 2027 / 90,000 km.',
    warranty: 'Balance of VW service plan + 12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2405',
    slug: 'toyota-hilux-28-gd6-legend-rs-4x4-2022',
    tagline: 'Unbreakable, now with attitude.',
    make: 'Toyota',
    model: 'Hilux',
    variant: '2.8 GD-6 Legend RS 4x4 A/T',
    year: 2022,
    price: 689900,
    bodyType: 'Double Cab',
    driveType: '4x4',
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: 61000,
    engineSize: '2.8L Turbodiesel',
    power: '150 kW',
    doors: 4,
    seats: 5,
    color: 'Attitude Black',
    condition: 'Very Good',
    stockNumber: 'MM-2405',
    vin: 'AHTFR22G507000005',
    dateAdded: '2026-05-12',
    locationId: 'gerrit-maritz-bakkie',
    featured: true,
    images: gallery('1532581140115-3e355d1ed1de', 8),
    description:
      'The benchmark double cab in flagship Legend RS guise — diff lock, low range, leather and the bulletproof 2.8 GD-6. Ready for the worksite on Monday and the Berg on Saturday.',
    highlights: [
      'Genuine 4x4 with rear diff lock',
      'Legend RS styling pack',
      'Leather & 9" infotainment',
      'Tow bar & rubberised load bin',
    ],
    features: [
      {
        category: 'Off-Road & Utility',
        items: ['Low range 4x4', 'Rear differential lock', 'Downhill assist control', 'Tow bar (3,500 kg braked)', 'Rubberised load bin'],
      },
      {
        category: 'Comfort & Convenience',
        items: ['Leather seats', 'Dual-zone climate', 'Keyless entry & start', 'Cruise control', 'Auto LED headlights'],
      },
      {
        category: 'Safety & Tech',
        items: ['Toyota Safety Sense', '7 airbags', 'Reverse camera', 'Apple CarPlay & Android Auto', 'Hill-start assist'],
      },
    ],
    serviceHistory: 'Full Toyota history. Service plan to 2028 / 90,000 km.',
    warranty: 'Balance of Toyota warranty + 12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2406',
    slug: 'ford-ranger-wildtrak-20-biturbo-4x4-2021',
    tagline: 'The all-rounder that does it all.',
    make: 'Ford',
    model: 'Ranger',
    variant: 'Wildtrak 2.0 BiTurbo 4x4 A/T',
    year: 2021,
    price: 579900,
    previousPrice: 619900,
    bodyType: 'Double Cab',
    driveType: '4x4',
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: 78500,
    engineSize: '2.0L BiTurbo',
    power: '157 kW',
    doors: 4,
    seats: 5,
    color: 'Sea Grey',
    condition: 'Very Good',
    stockNumber: 'MM-2406',
    vin: 'AFAPXXMJ2PMG00006',
    dateAdded: '2026-04-22',
    locationId: 'gerrit-maritz-bakkie',
    images: gallery('1614200179396-2bdb77ebf81b', 10),
    description:
      'A well-kept Wildtrak with the punchy 10-speed BiTurbo drivetrain, SYNC 3 and the full Wildtrak appearance pack. Just-reduced and ready to work.',
    highlights: [
      'Reduced by R40,000',
      '10-speed automatic',
      'SYNC 3 with 8" touchscreen',
      'Roller shutter & sports bar',
    ],
    features: [
      {
        category: 'Off-Road & Utility',
        items: ['Selectable 4x4', 'Electronic locking rear diff', 'Roller shutter load cover', 'Tow bar', 'Side steps'],
      },
      {
        category: 'Comfort & Convenience',
        items: ['Leather-trimmed seats', 'Dual-zone climate', 'Heated front seats', 'Keyless entry', 'Rain-sensing wipers'],
      },
      {
        category: 'Safety & Tech',
        items: ['Adaptive cruise control', 'Lane-keep assist', 'Reverse camera', 'SYNC 3 + CarPlay', 'Hill descent control'],
      },
    ],
    serviceHistory: 'Full Ford history, last serviced at 75,000 km.',
    warranty: '12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2407',
    slug: 'bmw-x5-xdrive30d-m-sport-2020',
    tagline: 'Effortless authority in every lane.',
    make: 'BMW',
    model: 'X5',
    variant: 'xDrive30d M Sport',
    year: 2020,
    price: 949900,
    bodyType: 'SUV',
    driveType: 'AWD',
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: 89000,
    engineSize: '3.0L Turbodiesel',
    power: '195 kW',
    doors: 5,
    seats: 5,
    color: 'Mineral White',
    condition: 'Very Good',
    stockNumber: 'MM-2407',
    vin: 'WBACV61000LH00007',
    dateAdded: '2026-04-15',
    locationId: 'rachel-de-beer-premium',
    featured: true,
    images: gallery('1568605117036-5fe5e7bab0b7', 1),
    description:
      'A commanding X5 xDrive30d with the silky straight-six diesel, air suspension and the M Sport package. Big on luxury, refinement and long-distance comfort.',
    highlights: [
      'Adaptive air suspension',
      'Panoramic sunroof',
      'Harman Kardon surround',
      'M Sport package',
    ],
    features: germanLuxFeatures(['Adaptive air suspension', 'Panoramic glass roof', 'Soft-close doors']),
    serviceHistory: 'Full BMW history. Motorplan available.',
    warranty: '12-month Mit-Mak warranty (extendable)',
  },
  {
    id: 'mm-2408',
    slug: 'range-rover-evoque-d180-r-dynamic-2020',
    tagline: 'Reductive design. Maximum presence.',
    make: 'Land Rover',
    model: 'Range Rover Evoque',
    variant: 'D180 R-Dynamic SE',
    year: 2020,
    price: 699900,
    bodyType: 'SUV',
    driveType: 'AWD',
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: 72400,
    engineSize: '2.0L Turbodiesel',
    power: '132 kW',
    doors: 5,
    seats: 5,
    color: 'Eiger Grey',
    condition: 'Very Good',
    stockNumber: 'MM-2408',
    vin: 'SALZA2BX0LH000008',
    dateAdded: '2026-03-28',
    locationId: 'rachel-de-beer-premium',
    reserved: true,
    images: gallery('1533473359331-0135ef1b58bf', 3),
    description:
      'A beautifully specced Evoque R-Dynamic with the Touch Pro Duo dual-screen system, meridian sound and genuine all-terrain ability under the tailored design.',
    highlights: [
      'R-Dynamic SE specification',
      'Touch Pro Duo dual screens',
      'Meridian sound system',
      'Terrain Response 2',
    ],
    features: germanLuxFeatures(['Configurable terrain response', 'Fixed panoramic roof']),
    serviceHistory: 'Full Land Rover history. Maintenance plan to 2025.',
    warranty: '12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2409',
    slug: 'porsche-911-carrera-s-2019',
    tagline: 'The icon. The benchmark. The dream.',
    make: 'Porsche',
    model: '911',
    variant: '992 Carrera S',
    year: 2019,
    price: 1999900,
    bodyType: 'Coupe',
    driveType: 'RWD',
    transmission: 'DCT',
    fuel: 'Petrol',
    mileage: 18900,
    engineSize: '3.0L Twin-Turbo',
    power: '331 kW',
    doors: 2,
    seats: 4,
    color: 'GT Silver Metallic',
    condition: 'Excellent',
    stockNumber: 'MM-2409',
    vin: 'WP0ZZZ99ZKS000009',
    dateAdded: '2026-05-29',
    locationId: 'rachel-de-beer-premium',
    featured: true,
    images: gallery('1583121274602-3e2820c69888', 5),
    description:
      'A breathtaking 992-generation Carrera S with the Sport Chrono package, PASM sport suspension and sub-19,000 km on the clock. A future classic, available now and delivered nationwide on a covered transporter.',
    highlights: [
      'Sport Chrono package',
      'PASM Sport suspension',
      'Sport exhaust system',
      'Under 19,000 km',
    ],
    features: [
      {
        category: 'Performance',
        items: ['Sport Chrono package', 'PASM sport suspension (-10mm)', 'Sport exhaust', '8-speed PDK', 'Launch control'],
      },
      {
        category: 'Comfort & Convenience',
        items: ['18-way adaptive sport seats', 'BOSE surround sound', 'Dual-zone climate', 'Keyless (Entry & Drive)', 'Lane-change assist'],
      },
      {
        category: 'Infotainment & Tech',
        items: ['PCM with online navigation', 'Apple CarPlay', 'Digital + analogue cluster', 'Wireless charging', 'Reverse camera'],
      },
    ],
    serviceHistory: 'Full Porsche history. Immaculate, garaged, non-smoker.',
    warranty: 'Porsche Approved options available + 12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2410',
    slug: 'mercedes-amg-a45-s-4matic-2021',
    tagline: 'The most powerful hot hatch ever built.',
    make: 'Mercedes-AMG',
    model: 'A-Class',
    variant: 'A45 S 4MATIC+',
    year: 2021,
    price: 1049900,
    bodyType: 'Hatchback',
    driveType: 'AWD',
    transmission: 'DCT',
    fuel: 'Petrol',
    mileage: 27600,
    engineSize: '2.0L Turbo',
    power: '310 kW',
    doors: 5,
    seats: 5,
    color: 'Jupiter Red',
    condition: 'Excellent',
    stockNumber: 'MM-2410',
    vin: 'W1K1770872J000010',
    dateAdded: '2026-05-20',
    locationId: 'rachel-de-beer-premium',
    featured: true,
    images: gallery('1494976388531-d1058494cdd8', 7),
    description:
      'The hand-built 310 kW A45 S — the most powerful production hot hatch on the planet. AMG Performance seats, drift mode, and a soundtrack that never gets old. Low mileage and flawless.',
    highlights: [
      'Hand-built “one man, one engine” M139',
      'AMG Performance 4MATIC+ with Drift Mode',
      'AMG Track Pace',
      'Burmester sound',
    ],
    features: [
      {
        category: 'Performance',
        items: ['AMG Performance 4MATIC+', 'Drift Mode', 'AMG Ride Control suspension', 'AMG sport exhaust', 'AMG Track Pace'],
      },
      {
        category: 'Comfort & Convenience',
        items: ['AMG Performance seats', 'Ambient lighting', 'Dual-zone climate', 'Keyless-Go', 'Wireless charging'],
      },
      {
        category: 'Infotainment & Tech',
        items: ['MBUX twin 10.25" displays', '“Hey Mercedes” voice', 'Apple CarPlay & Android Auto', 'Burmester sound', 'Augmented-reality nav'],
      },
    ],
    serviceHistory: 'Full Mercedes-AMG history. Service plan to 2026.',
    warranty: '12-month Mit-Mak warranty (extendable to 60 months)',
  },
  {
    id: 'mm-2411',
    slug: 'volkswagen-polo-10-tsi-comfortline-2021',
    tagline: 'Smart money’s first car.',
    make: 'Volkswagen',
    model: 'Polo',
    variant: '1.0 TSI Comfortline',
    year: 2021,
    price: 269900,
    bodyType: 'Hatchback',
    driveType: 'FWD',
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: 43300,
    engineSize: '1.0L TSI',
    power: '85 kW',
    doors: 5,
    seats: 5,
    color: 'Reef Blue',
    condition: 'Excellent',
    stockNumber: 'MM-2411',
    vin: 'WVWZZZAWZMU000011',
    dateAdded: '2026-05-05',
    locationId: 'gerrit-maritz-flagship',
    images: gallery('1609521263047-f8f205293f24', 9),
    description:
      'The sensible-but-fun Polo TSI — frugal, fizzy three-cylinder turbo, App-Connect and a build quality that punches above its price. Ideal first car or daily runabout.',
    highlights: [
      'Frugal 1.0 TSI turbo',
      'App-Connect (CarPlay/Android Auto)',
      'Low running costs',
      'Full service history',
    ],
    features: [
      {
        category: 'Comfort & Convenience',
        items: ['Manual air conditioning', 'Multifunction steering wheel', 'Electric windows', 'Cruise control', 'Front fog lamps'],
      },
      {
        category: 'Safety',
        items: ['ABS with EBD', 'ESC stability control', 'Front & side airbags', 'ISOFIX', 'Hill-hold control'],
      },
      {
        category: 'Infotainment & Tech',
        items: ['Composition Media touchscreen', 'App-Connect', 'Bluetooth', 'USB', 'Digital radio'],
      },
    ],
    serviceHistory: 'Full VW history, last serviced at 40,000 km.',
    warranty: '12-month Mit-Mak warranty',
  },
  {
    id: 'mm-2412',
    slug: 'audi-q5-40-tdi-quattro-s-line-2021',
    tagline: 'The do-everything premium SUV.',
    make: 'Audi',
    model: 'Q5',
    variant: '40 TDI quattro S line',
    year: 2021,
    price: 699900,
    previousPrice: 729900,
    bodyType: 'SUV',
    driveType: 'AWD',
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: 55100,
    engineSize: '2.0L TDI',
    power: '140 kW',
    doors: 5,
    seats: 5,
    color: 'Navarra Blue',
    condition: 'Very Good',
    stockNumber: 'MM-2412',
    vin: 'WAUZZZFY0M2000012',
    dateAdded: '2026-04-08',
    locationId: 'gerrit-maritz-flagship',
    images: gallery('1617814076367-b759c7d7e738', 11),
    description:
      'A handsomely-specced Q5 40 TDI quattro in S line trim — all-wheel-drive surety, Virtual Cockpit and a beautifully finished cabin. Recently reduced and ready to go.',
    highlights: [
      'Reduced by R30,000',
      'quattro all-wheel drive',
      'S line package',
      'Virtual Cockpit',
    ],
    features: germanLuxFeatures(['S line sport package', 'Power tailgate', 'Tri-zone climate']),
    serviceHistory: 'Full Audi history. Service plan available.',
    warranty: '12-month Mit-Mak warranty',
  },
];

// ───────────────────────── Derived helpers ─────────────────────────

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export const featuredVehicles = vehicles.filter((v) => v.featured);

export const heroVehicle = vehicles.find((v) => v.slug === 'porsche-911-carrera-s-2019')!;

export function relatedVehicles(vehicle: Vehicle, limit = 4): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== vehicle.id)
    .map((v) => {
      let score = 0;
      if (v.bodyType === vehicle.bodyType) score += 3;
      if (v.make === vehicle.make) score += 2;
      if (Math.abs(v.price - vehicle.price) < 200000) score += 2;
      if (v.driveType === vehicle.driveType) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.v);
}

// Taxonomy for filters (derived so it always matches inventory).
export const allMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
export const allBodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType)));
export const allDriveTypes = Array.from(new Set(vehicles.map((v) => v.driveType)));
export const allFuelTypes = Array.from(new Set(vehicles.map((v) => v.fuel)));
export const allTransmissions = Array.from(new Set(vehicles.map((v) => v.transmission)));

export const modelsByMake: Record<string, string[]> = vehicles.reduce(
  (acc, v) => {
    acc[v.make] = Array.from(new Set([...(acc[v.make] ?? []), v.model]));
    return acc;
  },
  {} as Record<string, string[]>,
);

export const priceBounds = {
  min: Math.min(...vehicles.map((v) => v.price)),
  max: Math.max(...vehicles.map((v) => v.price)),
};
export const yearBounds = {
  min: Math.min(...vehicles.map((v) => v.year)),
  max: Math.max(...vehicles.map((v) => v.year)),
};
export const mileageMax = Math.max(...vehicles.map((v) => v.mileage));
