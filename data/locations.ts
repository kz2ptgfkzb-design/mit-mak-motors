import type { Location } from '@/types';

// Real Mit-Mak Motors branch footprint, Pretoria North.
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
    id: 'gerrit-maritz-bakkie',
    name: 'Mit-Mak Motors, Gerrit Maritz',
    kind: 'Bakkie & 4x4 Centre',
    street: '591 Gerrit Maritz Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'sales@mitmakmotors.co.za',
    lat: -25.6752,
    lng: 28.1769,
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
    id: 'rachel-de-beer-trade',
    name: 'Mit-Mak Trade-In Centre',
    kind: 'Trade-In & Valuations',
    street: '450 Rachel de Beer Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'tradein@mitmakmotors.co.za',
    lat: -25.6785,
    lng: 28.1808,
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
  {
    id: 'rachel-de-beer-delivery',
    name: 'Mit-Mak Delivery Hub',
    kind: 'Reconditioning & Nationwide Delivery',
    street: '566 Rachel de Beer Street',
    suburb: 'Pretoria North',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0182',
    phone: PHONE,
    whatsapp: WA,
    email: 'delivery@mitmakmotors.co.za',
    lat: -25.6798,
    lng: 28.182,
  },
];

export const flagship = locations.find((l) => l.flagship) ?? locations[0];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
