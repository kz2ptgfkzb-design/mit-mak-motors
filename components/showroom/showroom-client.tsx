'use client';

import { useEffect, useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import type { VehicleFilters, SortKey } from '@/types';
import {
  vehicles,
  allMakes,
  allBodyTypes,
  allDriveTypes,
  allFuelTypes,
  allTransmissions,
  modelsByMake,
  priceBounds,
  yearBounds,
  mileageMax,
} from '@/data/vehicles';
import { filterVehicles, sortVehicles, defaultFilters, countActiveFilters } from '@/lib/filters';
import { FilterBar, type FilterMeta } from './filter-bar';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { VehicleListItem } from './vehicle-list-item';
import { VehicleSkeleton } from './vehicle-skeleton';
import { CompareTray } from './compare-drawer';
import { Button } from '@/components/ui/button';

const meta: FilterMeta = {
  makes: allMakes,
  modelsByMake,
  bodyTypes: allBodyTypes,
  driveTypes: allDriveTypes,
  fuels: allFuelTypes,
  transmissions: allTransmissions,
  priceBounds,
  yearBounds,
  mileageMax,
};

export function ShowroomClient({
  initialFilters,
  initialSort,
}: {
  initialFilters: Partial<VehicleFilters>;
  initialSort: SortKey;
}) {
  const [filters, setFilters] = useState<VehicleFilters>(() => defaultFilters(initialFilters));
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const results = useMemo(() => sortVehicles(filterVehicles(vehicles, filters), sort), [filters, sort]);
  const activeCount = countActiveFilters(filters);
  const compareVehicles = vehicles.filter((v) => compareIds.includes(v.id));

  // Brief skeleton state on filter/sort change for a polished feel.
  const sig = JSON.stringify(filters) + sort;
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [sig]);

  function patch(p: Partial<VehicleFilters>) {
    setFilters((f) => ({ ...f, ...p }));
  }
  function clear() {
    setFilters(defaultFilters());
  }
  function toggleCompare(id: string) {
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < 4 ? [...ids, id] : ids));
  }

  return (
    <>
      <FilterBar
        filters={filters}
        onChange={patch}
        onClear={clear}
        meta={meta}
        resultCount={results.length}
        activeCount={activeCount}
        sort={sort}
        onSort={setSort}
        view={view}
        onView={setView}
      />

      <div className="container py-10 lg:py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-24 text-center">
            <SearchX className="h-10 w-10 text-graphite-500" />
            <h3 className="mt-5 font-display text-2xl uppercase tracking-tight text-white">No matches</h3>
            <p className="mt-2 max-w-sm text-sm text-graphite-400">
              Nothing in the current stock fits those filters. Try widening your search — new arrivals land weekly.
            </p>
            <Button onClick={clear} variant="outline" className="mt-6">
              Clear all filters
            </Button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((v, i) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                priority={i < 3}
                selectable
                selected={compareIds.includes(v.id)}
                onSelect={() => toggleCompare(v.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((v) => (
              <VehicleListItem key={v.id} vehicle={v} selected={compareIds.includes(v.id)} onSelect={() => toggleCompare(v.id)} />
            ))}
          </div>
        )}
      </div>

      <CompareTray vehicles={compareVehicles} onRemove={toggleCompare} onClear={() => setCompareIds([])} />
    </>
  );
}
