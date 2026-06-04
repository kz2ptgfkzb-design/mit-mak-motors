'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { BodyType } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { BodyTypeIcon, SHORTCUT_BODY_TYPES } from '@/components/ui/body-type-icons';
import type { FilterMeta } from './filter-bar';

export interface FinderSelection {
  bodyType: BodyType | '';
  make: string;
  model: string;
  variant: string;
  maxPrice: number | null;
}

// Sensible "up to" budget rungs; trimmed to the real top price at runtime.
const PRICE_STEPS = [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000];

function FinderSelect({
  value,
  onChange,
  ariaLabel,
  disabled,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        data-cursor="hover"
        className="peer h-12 w-full cursor-pointer appearance-none truncate rounded-xl border border-white/12 bg-ink-850 pl-4 pr-9 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-red disabled:cursor-not-allowed disabled:opacity-40 [&>option]:bg-ink-900 [&>option]:text-white"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500 transition-colors peer-focus:text-red" />
    </div>
  );
}

export function CarFinder({
  meta,
  onSearch,
  className,
}: {
  meta: FilterMeta;
  onSearch: (sel: FinderSelection) => void;
  className?: string;
}) {
  const [bodyType, setBodyType] = useState<BodyType | ''>('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const modelOptions = useMemo(() => {
    if (make) return meta.modelsByMake[make] ?? [];
    return Array.from(new Set(Object.values(meta.modelsByMake).flat())).sort();
  }, [make, meta.modelsByMake]);

  const variantOptions = useMemo(() => {
    if (make && model) return meta.variantsByMakeModel[`${make}__${model}`] ?? [];
    return [];
  }, [make, model, meta.variantsByMakeModel]);

  const priceOptions = useMemo(() => {
    const max = meta.priceBounds.max;
    const steps = PRICE_STEPS.filter((p) => p <= max);
    if (steps.length === 0 || steps[steps.length - 1] < max) steps.push(max);
    return steps;
  }, [meta.priceBounds.max]);

  function selection(overrides: Partial<FinderSelection> = {}): FinderSelection {
    return {
      bodyType,
      make,
      model,
      variant,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      ...overrides,
    };
  }

  function pickType(bt: BodyType) {
    const next = bt === bodyType ? '' : bt;
    setBodyType(next);
    onSearch(selection({ bodyType: next }));
  }

  return (
    <div className={className}>
      <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-3 shadow-card backdrop-blur-xl sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
          <FinderSelect value={bodyType} onChange={(v) => setBodyType(v as BodyType | '')} ariaLabel="Body type">
            <option value="">Type</option>
            {meta.bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </FinderSelect>

          <FinderSelect
            value={make}
            onChange={(v) => {
              setMake(v);
              setModel('');
              setVariant('');
            }}
            ariaLabel="Make"
          >
            <option value="">All Makes</option>
            {meta.makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FinderSelect>

          <FinderSelect
            value={model}
            onChange={(v) => {
              setModel(v);
              setVariant('');
            }}
            ariaLabel="Model"
          >
            <option value="">All Models</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FinderSelect>

          <FinderSelect value={variant} onChange={setVariant} ariaLabel="Variant" disabled={!model}>
            <option value="">{model ? 'All Variants' : 'Variant'}</option>
            {variantOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </FinderSelect>

          <FinderSelect value={maxPrice} onChange={setMaxPrice} ariaLabel="Maximum price">
            <option value="">Max Price</option>
            {priceOptions.map((p) => (
              <option key={p} value={p}>
                {formatPrice(p)}
              </option>
            ))}
          </FinderSelect>

          <button
            type="button"
            onClick={() => onSearch(selection())}
            data-cursor="hover"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red px-6 font-display text-xs font-medium uppercase tracking-wide text-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-glow"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:mt-7 sm:gap-x-7">
        {SHORTCUT_BODY_TYPES.map((bt) => {
          const active = bt === bodyType;
          return (
            <button
              key={bt}
              type="button"
              onClick={() => pickType(bt)}
              data-cursor="hover"
              aria-pressed={active}
              className="group flex w-16 flex-col items-center gap-2 sm:w-[4.75rem]"
            >
              <span
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 sm:h-16 sm:w-16',
                  active
                    ? 'border-red bg-red/10 text-red'
                    : 'border-white/15 text-graphite-200 group-hover:border-red group-hover:text-white',
                )}
              >
                <BodyTypeIcon type={bt} className="w-10 sm:w-11" />
              </span>
              <span
                className={cn(
                  'text-center font-display text-[11px] uppercase tracking-wide transition-colors',
                  active ? 'text-white' : 'text-graphite-400 group-hover:text-white',
                )}
              >
                {bt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
