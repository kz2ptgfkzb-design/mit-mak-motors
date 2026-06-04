import type { Location } from '@/types';

// Real Mit-Mak Motors footprint, Pretoria North: three customer-facing
// branches on Gerrit Maritz & Rachel de Beer Streets.
// (Phone is the published main line; per-branch direct lines & exact
// coordinates can be refined.) IDs are stable, inventory references them.
const PHONE = '+27 12 546 5878';
const WA = '27125465878';

export const locations: Location[] = [
  {
    id: 'gerrit-maritz-flagship',
    name: 'Mit-Mak Motors, Flagship',
    kind: 'Flagship Showroom',
    street: '590 Gerrit Maritz Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'sales@mitmakmotors.co.za',
    lat: -25.6748,
    lng: 28.1763,
    flagship: true,
  },
  {
    id: 'rachel-de-beer-premium',
    name: 'Mit-Mak Premium',
    kind: 'Premium & Performance',
    street: '446 Rachel de Beer Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'premium@mitmakmotors.co.za',
    lat: -25.6779,
    lng: 28.1801,
  },
  {
    id: 'gerrit-maritz-finance',
    name: 'Mit-Mak Finance House',
    kind: 'Finance & Insurance',
    street: '565 Rachel de Beer Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'finance@mitmakmotors.co.za',
    lat: -25.6792,
    lng: 28.1814,
  },
];

export const flagship = locations.find((l) => l.flagship) ?? locations[0];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
