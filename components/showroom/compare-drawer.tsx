'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { carImage } from '@/lib/img';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { X, GitCompare, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '@/types';
import { COMPARE_ROWS } from '@/lib/compare';

export function CompareTray({
  vehicles,
  onRemove,
  onClear,
}: {
  vehicles: Vehicle[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  useEffect(() => {
    if (vehicles.length === 0) setOpen(false);
  }, [vehicles.length]);

  const cols = `minmax(110px,140px) repeat(${vehicles.length}, minmax(150px,1fr))`;

  return (
    <>
      <AnimatePresence>
        {vehicles.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-1/2 z-[88] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-white/10 bg-ink-850/95 p-3 shadow-card backdrop-blur-xl sm:bottom-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 overflow-x-auto hide-scrollbar">
                {vehicles.map((v) => (
                  <div key={v.id} className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image src={carImage(v.images[0], 160)} alt={v.model} fill placeholder="blur" blurDataURL={BLUR} unoptimized sizes="64px" className="object-cover" />
                    <button
                      onClick={() => onRemove(v.id)}
                      aria-label={`Remove ${v.model}`}
                      className="absolute right-0.5 top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ink-950/80 text-white"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - vehicles.length) }).map((_, i) => (
                  <div key={i} className="hidden h-12 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10 text-[10px] text-graphite-600 sm:flex">
                    +
                  </div>
                ))}
              </div>
              <button
                onClick={() => setOpen(true)}
                disabled={vehicles.length < 2}
                data-cursor="hover"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-red px-5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow-sm disabled:opacity-40"
              >
                <GitCompare className="h-4 w-4" /> Compare {vehicles.length}
              </button>
              <button onClick={onClear} aria-label="Clear comparison" data-cursor="hover" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-graphite-300 hover:border-white/40 hover:text-white sm:inline-flex">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-ink-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <GitCompare className="h-5 w-5 text-red" />
                <h2 className="font-display text-xl uppercase tracking-tight text-white">Compare Vehicles</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" data-cursor="hover" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-graphite-200 hover:border-red hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-auto pb-16">
              <div className="container">
                <div className="min-w-[560px]">
                  {/* Vehicle headers */}
                  <div className="grid gap-px" style={{ gridTemplateColumns: cols }}>
                    <div />
                    {vehicles.map((v) => (
                      <div key={v.id} className="px-2">
                        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                          <Image src={carImage(v.images[0], 420)} alt={v.model} fill placeholder="blur" blurDataURL={BLUR} unoptimized sizes="200px" className="object-cover" />
                          <button onClick={() => onRemove(v.id)} aria-label="Remove" className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/80 text-white hover:bg-red">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-display text-[10px] uppercase tracking-widest text-red">{v.make}</p>
                        <p className="font-display text-sm uppercase leading-tight text-white">{v.model} {v.variant}</p>
                      </div>
                    ))}
                  </div>

                  {/* Spec rows */}
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                    {COMPARE_ROWS.map((row, i) => (
                      <div
                        key={row.label}
                        className="grid gap-px"
                        style={{ gridTemplateColumns: cols, backgroundColor: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                      >
                        <div className="px-4 py-3 font-display text-[11px] uppercase tracking-wide text-graphite-400">{row.label}</div>
                        {vehicles.map((v) => (
                          <div key={v.id} className="px-3 py-3 text-sm text-white">{row.get(v)}</div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="mt-4 grid gap-px" style={{ gridTemplateColumns: cols }}>
                    <div />
                    {vehicles.map((v) => (
                      <div key={v.id} className="px-2">
                        <Link
                          href={`/vehicles/${v.slug}`}
                          onClick={() => setOpen(false)}
                          data-cursor="hover"
                          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-red font-display text-[11px] uppercase tracking-wide text-white hover:shadow-glow-sm"
                        >
                          View <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
