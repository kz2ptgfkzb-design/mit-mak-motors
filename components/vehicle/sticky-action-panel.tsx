'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, FileText, Share2, Check, MapPin, BadgeCheck } from 'lucide-react';
import type { Vehicle } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { estimateMonthly } from '@/lib/finance';
import { siteConfig, whatsappLink } from '@/data/site';
import { getLocation } from '@/data/locations';
import { FinanceCalculator } from './finance-calculator';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.05 20.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function StickyActionPanel({ vehicle }: { vehicle: Vehicle }) {
  const [copied, setCopied] = useState(false);
  const location = getLocation(vehicle.locationId);
  const monthly = estimateMonthly(vehicle.price);
  const waMessage = `Hi Mit-Mak, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant} (Stock ${vehicle.stockNumber}), listed at ${formatPrice(vehicle.price)}.`;

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div id="reserve" className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/10 bg-ink-850 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.18em] text-red">{vehicle.make}</p>
            <p className="font-display text-2xl uppercase leading-tight tracking-tight text-white">
              {vehicle.model} {vehicle.variant}
            </p>
            <p className="mt-1 text-sm text-graphite-400">{vehicle.year} · {formatNumber(vehicle.mileage)} km · {vehicle.fuel}</p>
          </div>
          <button onClick={share} aria-label="Share" data-cursor="hover" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-graphite-300 transition-colors hover:border-red hover:text-white">
            {copied ? <Check className="h-4 w-4 text-red" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-anton text-4xl leading-none text-white">{formatPrice(vehicle.price)}</span>
          {vehicle.previousPrice && (
            <span className="mb-1 text-sm text-graphite-500 line-through">{formatPrice(vehicle.previousPrice)}</span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-graphite-300">
          from <span className="text-white">{formatPrice(monthly)}</span> p/m
        </p>

        {vehicle.reserved ? (
          <div className="mt-5 rounded-full border border-white/20 bg-white/5 py-3 text-center font-display text-xs uppercase tracking-wide text-graphite-200">
            Reserved, join the waitlist
          </div>
        ) : (
          <Link
            href={`/contact?vehicle=${vehicle.slug}&intent=reserve`}
            data-cursor="hover"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-red font-display text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            Reserve This Car
          </Link>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <a href={`tel:${siteConfig.phoneHref}`} data-cursor="hover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 font-display text-xs uppercase tracking-wide text-white transition-colors hover:border-white/40">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 font-display text-xs uppercase tracking-wide text-white transition-colors hover:border-red">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </a>
        </div>
        <Link href={`/finance?vehicle=${vehicle.slug}`} data-cursor="hover" className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/[0.06] font-display text-xs uppercase tracking-wide text-white transition-colors hover:bg-white/10">
          <FileText className="h-4 w-4" /> Online Finance Application
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-xs text-graphite-400">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-red" /> Stock {vehicle.stockNumber}
          </span>
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-red" /> {location.name}
            </span>
          )}
        </div>
      </div>

      <FinanceCalculator price={vehicle.price} vehicleSlug={vehicle.slug} className="mt-4" compact />
    </div>
  );
}
