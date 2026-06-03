import type { Vehicle, VehicleFilters, SortKey } from '@/types';

export function defaultFilters(overrides: Partial<VehicleFilters> = {}): VehicleFilters {
  return {
    q: '',
    make: [],
    model: [],
    bodyType: [],
    driveType: [],
    fuel: [],
    transmission: [],
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
    ...overrides,
  };
}

export function filterVehicles(vehicles: Vehicle[], f: VehicleFilters): Vehicle[] {
  return vehicles.filter((v) => {
    if (f.q.trim()) {
      const hay = `${v.make} ${v.model} ${v.variant} ${v.year} ${v.bodyType} ${v.fuel} ${v.color}`.toLowerCase();
      if (!hay.includes(f.q.trim().toLowerCase())) return false;
    }
    if (f.make.length && !f.make.includes(v.make)) return false;
    if (f.model.length && !f.model.includes(v.model)) return false;
    if (f.bodyType.length && !f.bodyType.includes(v.bodyType)) return false;
    if (f.driveType.length && !f.driveType.includes(v.driveType)) return false;
    if (f.fuel.length && !f.fuel.includes(v.fuel)) return false;
    if (f.transmission.length && !f.transmission.includes(v.transmission)) return false;
    if (f.minPrice != null && v.price < f.minPrice) return false;
    if (f.maxPrice != null && v.price > f.maxPrice) return false;
    if (f.minYear != null && v.year < f.minYear) return false;
    if (f.maxYear != null && v.year > f.maxYear) return false;
    if (f.maxMileage != null && v.mileage > f.maxMileage) return false;
    return true;
  });
}

export function sortVehicles(vehicles: Vehicle[], sort: SortKey): Vehicle[] {
  const copy = [...vehicles];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'year-desc':
      return copy.sort((a, b) => b.year - a.year);
    case 'mileage-asc':
      return copy.sort((a, b) => a.mileage - b.mileage);
    case 'newest':
    default:
      return copy.sort((a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded));
  }
}

export function countActiveFilters(f: VehicleFilters): number {
  let n = 0;
  if (f.q.trim()) n++;
  n += f.make.length + f.model.length + f.bodyType.length + f.driveType.length + f.fuel.length + f.transmission.length;
  if (f.minPrice != null) n++;
  if (f.maxPrice != null) n++;
  if (f.minYear != null) n++;
  if (f.maxYear != null) n++;
  if (f.maxMileage != null) n++;
  return n;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'mileage-asc', label: 'Mileage: Lowest' },
];
