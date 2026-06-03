'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gauge, CalendarDays, Fuel, Cog, ArrowRight, Check, GitCompare } from 'lucide-react';
import type { Vehicle } from '@/types';
import { cn, formatPrice, formatMileage } from '@/lib/utils';
import { estimateMonthly } from '@/lib/finance';
import { DriveBadge, StatusBadge } from '@/components/ui/badge';

export function VehicleListItem({
  vehicle,
  selected = false,
  onSelect,
}: {
  vehicle: Vehicle;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const href = `/vehicles/${vehicle.slug}`;
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-ink-850 p-3 transition-colors sm:flex-row',
        selected ? 'border-red/70 shadow-glow-sm' : 'border-white/10 hover:border-white/25',
      )}
    >
      <Link href={href} data-cursor="view" data-cursor-text="View" className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-64">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width:640px) 90vw, 256px"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex gap-2">
          {vehicle.reserved && <StatusBadge status="reserved">Reserved</StatusBadge>}
          {vehicle.previousPrice && !vehicle.reserved && <StatusBadge status="reduced">Reduced</StatusBadge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.18em] text-red">{vehicle.make}</p>
            <Link href={href} className="block">
              <h3 className="font-display text-xl uppercase leading-tight tracking-tight text-white">
                {vehicle.model} {vehicle.variant}
              </h3>
            </Link>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-bold leading-none text-white">{formatPrice(vehicle.price)}</p>
            <p className="mt-1 text-[11px] text-graphite-400">from {formatPrice(estimateMonthly(vehicle.price))} p/m</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-graphite-300">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.year}</span>
          <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-graphite-500" /> {formatMileage(vehicle.mileage)}</span>
          <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.fuel}</span>
          <span className="inline-flex items-center gap-1.5"><Cog className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.transmission}</span>
          <DriveBadge drive={vehicle.driveType} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-graphite-400">{vehicle.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={href}
            data-cursor="hover"
            className="group/btn inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white/[0.06] px-5 font-display text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-red"
          >
            View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
          {onSelect && (
            <button
              type="button"
              onClick={onSelect}
              aria-pressed={selected}
              data-cursor="hover"
              className={cn(
                'inline-flex h-10 items-center gap-1.5 rounded-full border px-4 font-display text-[11px] uppercase tracking-wide transition-colors',
                selected ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-200 hover:border-red hover:text-white',
              )}
            >
              {selected ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
              {selected ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
