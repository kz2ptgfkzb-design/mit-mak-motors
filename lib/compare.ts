import type { Vehicle } from '@/types';
import { formatPrice, formatMileage } from '@/lib/utils';
import { estimateMonthly } from '@/lib/finance';

export interface CompareRow {
  label: string;
  get: (v: Vehicle) => string;
}

/**
 * Shared spec rows for vehicle comparison, used by both the showroom
 * CompareTray overlay and the dedicated /compare page so the two never drift.
 */
export const COMPARE_ROWS: CompareRow[] = [
  { label: 'Price', get: (v) => formatPrice(v.price) },
  { label: 'From p/m', get: (v) => `${formatPrice(estimateMonthly(v.price))}` },
  { label: 'Year', get: (v) => `${v.year}` },
  { label: 'Mileage', get: (v) => formatMileage(v.mileage) },
  { label: 'Body Type', get: (v) => v.bodyType },
  { label: 'Drive', get: (v) => v.driveType },
  { label: 'Transmission', get: (v) => v.transmission },
  { label: 'Fuel', get: (v) => v.fuel },
  { label: 'Engine', get: (v) => v.engineSize },
  { label: 'Power', get: (v) => v.power || '-' },
  { label: 'Doors', get: (v) => `${v.doors}` },
  { label: 'Seats', get: (v) => `${v.seats}` },
  { label: 'Colour', get: (v) => v.color },
  { label: 'Condition', get: (v) => v.condition },
  { label: 'Stock No.', get: (v) => v.stockNumber },
];
