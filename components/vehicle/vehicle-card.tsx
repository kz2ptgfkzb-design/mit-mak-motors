'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Gauge, CalendarDays, Fuel, Cog, ArrowRight, Check, GitCompare } from 'lucide-react';
import type { Vehicle } from '@/types';
import { cn, formatPrice, formatMileage, formatNumber } from '@/lib/utils';
import { estimateMonthly } from '@/lib/finance';
import { DriveBadge, StatusBadge } from '@/components/ui/badge';

export function VehicleCard({
  vehicle,
  className,
  priority = false,
  selectable = false,
  selected = false,
  onSelect,
}: {
  vehicle: Vehicle;
  className?: string;
  priority?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  const href = `/vehicles/${vehicle.slug}`;
  const monthly = estimateMonthly(vehicle.price);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000, willChange: 'transform' }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850 transition-colors duration-300 hover:border-white/25 hover:shadow-card',
        selected && 'border-red/70 shadow-glow-sm',
        className,
      )}
    >
      {selectable && (
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={selected ? 'Remove from compare' : 'Add to compare'}
          data-cursor="hover"
          className={cn(
            'absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-display text-[10px] uppercase tracking-wide backdrop-blur transition-colors',
            selected
              ? 'border-red bg-red text-white'
              : 'border-white/20 bg-ink-900/60 text-graphite-200 hover:border-white/50 hover:text-white',
          )}
        >
          {selected ? <Check className="h-3 w-3" /> : <GitCompare className="h-3 w-3" />}
          {selected ? 'Added' : 'Compare'}
        </button>
      )}
      <Link href={href} data-cursor="view" data-cursor-text="View" className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
          <Image
            src={vehicle.images[0]}
            unoptimized
            placeholder="blur"
            blurDataURL={BLUR}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`}
            fill
            sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
            priority={priority}
            className="object-cover transition-all duration-700 ease-out-expo group-hover:scale-[1.06] group-hover:opacity-0"
          />
          {vehicle.images[1] && (
            <Image
              src={vehicle.images[1]}
              unoptimized
              placeholder="blur"
              blurDataURL={BLUR}
              alt=""
              fill
              sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
              className="object-cover opacity-0 transition-all duration-700 ease-out-expo group-hover:scale-[1.06] group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

          {/* Status badges */}
          <div className={cn('absolute left-3 z-[5] flex flex-wrap gap-2', selectable ? 'top-14' : 'top-3')}>
            {vehicle.reserved && <StatusBadge status="reserved">Reserved</StatusBadge>}
            {vehicle.previousPrice && !vehicle.reserved && <StatusBadge status="reduced">Reduced</StatusBadge>}
            {vehicle.featured && !vehicle.reserved && !vehicle.previousPrice && (
              <StatusBadge status="featured">Featured</StatusBadge>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <DriveBadge drive={vehicle.driveType} />
          </div>

          {/* Price */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl font-bold leading-none text-white red-glow-text">
                {formatPrice(vehicle.price)}
              </p>
              <p className="mt-1 text-[11px] text-graphite-300">
                from <span className="text-white">{formatPrice(monthly)}</span> p/m
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="block">
          <p className="font-display text-[11px] uppercase tracking-[0.18em] text-red">
            {vehicle.make}
          </p>
          <h3 className="mt-0.5 truncate font-display text-lg uppercase leading-tight tracking-tight text-white">
            {vehicle.model} {vehicle.variant}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-graphite-300">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.year}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-graphite-500" /> {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.fuel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5 text-graphite-500" /> {vehicle.transmission}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 pt-1">
          <Link
            href={href}
            data-cursor="hover"
            className="group/btn inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white/[0.06] font-display text-[11px] uppercase tracking-wide text-white transition-colors hover:bg-red"
          >
            View
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
          <Link
            href={`${href}#reserve`}
            data-cursor="hover"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-4 font-display text-[11px] uppercase tracking-wide text-graphite-200 transition-colors hover:border-red hover:text-white"
          >
            Reserve
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
