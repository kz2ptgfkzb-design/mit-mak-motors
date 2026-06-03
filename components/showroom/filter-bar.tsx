'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { VehicleFilters, SortKey, BodyType, DriveType, FuelType, Transmission } from '@/types';
import { cn, formatPrice, formatMileage } from '@/lib/utils';
import { SORT_OPTIONS } from '@/lib/filters';

export interface FilterMeta {
  makes: string[];
  modelsByMake: Record<string, string[]>;
  bodyTypes: BodyType[];
  driveTypes: DriveType[];
  fuels: FuelType[];
  transmissions: Transmission[];
  priceBounds: { min: number; max: number };
  yearBounds: { min: number; max: number };
  mileageMax: number;
}

interface Props {
  filters: VehicleFilters;
  onChange: (patch: Partial<VehicleFilters>) => void;
  onClear: () => void;
  meta: FilterMeta;
  resultCount: number;
  activeCount: number;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  view: 'grid' | 'list';
  onView: (v: 'grid' | 'list') => void;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
        active ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-200 hover:border-white/40 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 font-display text-[11px] uppercase tracking-[0.18em] text-graphite-400">{label}</p>
      {children}
    </div>
  );
}

const numberInput =
  'h-10 w-full rounded-lg border border-white/15 bg-ink-900 px-3 text-sm text-white outline-none placeholder:text-graphite-600 focus:border-red';

export function FilterBar({ filters, onChange, onClear, meta, resultCount, activeCount, sort, onSort, view, onView }: Props) {
  const [open, setOpen] = useState(false);

  const availableModels = filters.make.length
    ? Array.from(new Set(filters.make.flatMap((m) => meta.modelsByMake[m] ?? [])))
    : Object.values(meta.modelsByMake).flat();

  return (
    <div className="sticky top-[66px] z-40 border-y border-white/10 bg-ink-950/90 backdrop-blur-xl">
      <div className="container py-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex h-11 min-w-[180px] flex-1 items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-graphite-500" />
            <input
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search make, model, variant…"
              aria-label="Search vehicles"
              className="h-11 w-full rounded-full border border-white/15 bg-ink-900 pl-10 pr-4 text-sm text-white outline-none placeholder:text-graphite-600 focus:border-red"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            data-cursor="hover"
            aria-expanded={open}
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-full border px-4 font-display text-xs uppercase tracking-wide transition-colors',
              open || activeCount ? 'border-red text-white' : 'border-white/15 text-graphite-200 hover:border-white/40',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-[10px] text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as SortKey)}
              aria-label="Sort vehicles"
              className="h-11 cursor-pointer appearance-none rounded-full border border-white/15 bg-ink-900 pl-4 pr-10 text-xs font-medium text-white outline-none focus:border-red"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-ink-900">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" />
          </div>

          <div className="flex h-11 items-center rounded-full border border-white/15 p-1">
            <button
              onClick={() => onView('grid')}
              aria-label="Grid view"
              data-cursor="hover"
              className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors', view === 'grid' ? 'bg-red text-white' : 'text-graphite-400 hover:text-white')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onView('list')}
              aria-label="List view"
              data-cursor="hover"
              className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors', view === 'list' ? 'bg-red text-white' : 'text-graphite-400 hover:text-white')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-graphite-400">
            <span className="font-display text-sm text-white">{resultCount}</span> {resultCount === 1 ? 'vehicle' : 'vehicles'} available
          </span>
          {activeCount > 0 && (
            <button onClick={onClear} data-cursor="hover" className="inline-flex items-center gap-1.5 text-graphite-300 hover:text-red">
              <X className="h-3.5 w-3.5" /> Clear all
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="container grid grid-cols-1 gap-7 py-7 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Make">
                <div className="flex flex-wrap gap-2">
                  {meta.makes.map((m) => (
                    <Chip key={m} active={filters.make.includes(m)} onClick={() => onChange({ make: toggle(filters.make, m), model: [] })}>
                      {m}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Model">
                <div className="flex flex-wrap gap-2">
                  {availableModels.map((m) => (
                    <Chip key={m} active={filters.model.includes(m)} onClick={() => onChange({ model: toggle(filters.model, m) })}>
                      {m}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Body Type">
                <div className="flex flex-wrap gap-2">
                  {meta.bodyTypes.map((b) => (
                    <Chip key={b} active={filters.bodyType.includes(b)} onClick={() => onChange({ bodyType: toggle(filters.bodyType, b) })}>
                      {b}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Drive Type">
                <div className="flex flex-wrap gap-2">
                  {meta.driveTypes.map((d) => (
                    <Chip key={d} active={filters.driveType.includes(d)} onClick={() => onChange({ driveType: toggle(filters.driveType, d) })}>
                      {d}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Fuel">
                <div className="flex flex-wrap gap-2">
                  {meta.fuels.map((f) => (
                    <Chip key={f} active={filters.fuel.includes(f)} onClick={() => onChange({ fuel: toggle(filters.fuel, f) })}>
                      {f}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Transmission">
                <div className="flex flex-wrap gap-2">
                  {meta.transmissions.map((t) => (
                    <Chip key={t} active={filters.transmission.includes(t)} onClick={() => onChange({ transmission: toggle(filters.transmission, t) })}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field label="Price (R)">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.minPrice ?? ''}
                    onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder={`${meta.priceBounds.min}`}
                    className={numberInput}
                    aria-label="Minimum price"
                  />
                  <span className="text-graphite-600">–</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.maxPrice ?? ''}
                    onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder={`${meta.priceBounds.max}`}
                    className={numberInput}
                    aria-label="Maximum price"
                  />
                </div>
              </Field>

              <Field label="Year">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.minYear ?? ''}
                    onChange={(e) => onChange({ minYear: e.target.value ? Number(e.target.value) : null })}
                    placeholder={`${meta.yearBounds.min}`}
                    className={numberInput}
                    aria-label="Minimum year"
                  />
                  <span className="text-graphite-600">–</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filters.maxYear ?? ''}
                    onChange={(e) => onChange({ maxYear: e.target.value ? Number(e.target.value) : null })}
                    placeholder={`${meta.yearBounds.max}`}
                    className={numberInput}
                    aria-label="Maximum year"
                  />
                </div>
              </Field>

              <Field label={`Max mileage · ${filters.maxMileage ? formatMileage(filters.maxMileage) : 'Any'}`}>
                <input
                  type="range"
                  min={0}
                  max={meta.mileageMax}
                  step={5000}
                  value={filters.maxMileage ?? meta.mileageMax}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    onChange({ maxMileage: v >= meta.mileageMax ? null : v });
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-red"
                  aria-label="Maximum mileage"
                />
                <div className="mt-1 flex justify-between text-[10px] text-graphite-600">
                  <span>0 km</span>
                  <span>{formatMileage(meta.mileageMax)}</span>
                </div>
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
