'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { carImage } from '@/lib/img';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { GitCompare, Plus, X, Search, Check, ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { COMPARE_ROWS } from '@/lib/compare';

const MAX = 4;

export function CompareClient({ cards, initialIds }: { cards: Vehicle[]; initialIds: string[] }) {
  const [ids, setIds] = useState<string[]>(initialIds);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const lenis = useLenis();

  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c] as const)), [cards]);
  const selected = ids.map((id) => byId.get(id)).filter(Boolean) as Vehicle[];
  const full = selected.length >= MAX;

  // Keep the URL in sync so a comparison is shareable + bookmarkable.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (ids.length) url.searchParams.set('ids', ids.join(','));
    else url.searchParams.delete('ids');
    window.history.replaceState(null, '', url.toString());
  }, [ids]);

  // Lock page scroll while the picker is open (mirrors the CompareTray overlay).
  useEffect(() => {
    if (!pickerOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPickerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen, lenis]);

  function remove(id: string) {
    setIds((cur) => cur.filter((x) => x !== id));
  }
  function toggle(id: string) {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < MAX ? [...cur, id] : cur));
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? cards.filter((c) => `${c.year} ${c.make} ${c.model} ${c.variant}`.toLowerCase().includes(q))
      : cards;
    return base.slice(0, 60);
  }, [cards, query]);

  const cols = `minmax(116px,150px) repeat(${selected.length}, minmax(150px,1fr))`;

  return (
    <section className="container py-12 lg:py-16">
      {selected.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red/15 text-red">
            <GitCompare className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl uppercase tracking-tight text-white">Build your comparison</h2>
          <p className="mt-2 max-w-md text-sm text-graphite-400">
            Add up to four cars and see their price, spec, power and mileage lined up side by side.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            data-cursor="hover"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add a car
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm uppercase tracking-wide text-graphite-300">
              Comparing <span className="text-white">{selected.length}</span> of {MAX}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPickerOpen(true)}
                disabled={full}
                data-cursor="hover"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-red px-5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow-sm disabled:opacity-40"
              >
                <Plus className="h-4 w-4" /> Add a car
              </button>
              <button
                onClick={() => setIds([])}
                data-cursor="hover"
                className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 font-display text-xs uppercase tracking-wide text-graphite-200 transition-colors hover:border-white/40 hover:text-white"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="overflow-x-auto hide-scrollbar">
            <div className="min-w-[560px]">
              {/* Vehicle headers */}
              <div className="grid gap-px" style={{ gridTemplateColumns: cols }}>
                <div />
                {selected.map((v) => (
                  <div key={v.id} className="px-2">
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ink-900">
                      {v.images[0] && (
                        <Image src={carImage(v.images[0], 480)} alt={`${v.make} ${v.model}`} fill placeholder="blur" blurDataURL={BLUR} unoptimized sizes="220px" className="object-cover" />
                      )}
                      <button
                        onClick={() => remove(v.id)}
                        aria-label={`Remove ${v.make} ${v.model}`}
                        className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/80 text-white transition-colors hover:bg-red"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-[10px] uppercase tracking-widest text-red">{v.make}</p>
                    <p className="font-display text-sm uppercase leading-tight text-white">
                      {v.model} {v.variant}
                    </p>
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
                    {selected.map((v) => (
                      <div key={v.id} className="px-3 py-3 text-sm text-white">
                        {row.get(v)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div className="mt-4 grid gap-px" style={{ gridTemplateColumns: cols }}>
                <div />
                {selected.map((v) => (
                  <div key={v.id} className="px-2">
                    <Link
                      href={`/vehicles/${v.slug}`}
                      data-cursor="hover"
                      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-red font-display text-[11px] uppercase tracking-wide text-white transition-shadow hover:shadow-glow-sm"
                    >
                      View <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selected.length < 2 && (
            <p className="mt-6 text-center text-sm text-graphite-400">Add at least one more car to line them up side by side.</p>
          )}
        </>
      )}

      {/* Car picker */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-ink-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="container flex items-center gap-3 py-6">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search make, model or year"
                  className="h-12 w-full rounded-full border border-white/15 bg-ink-900 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-red placeholder:text-graphite-600"
                />
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                data-cursor="hover"
                className="inline-flex h-12 shrink-0 items-center rounded-full border border-white/15 px-5 font-display text-xs uppercase tracking-wide text-white transition-colors hover:border-red"
              >
                Done
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-auto pb-16">
              <div className="container">
                <p className="mb-3 font-display text-[11px] uppercase tracking-wide text-graphite-500">
                  {full ? 'Maximum of 4 reached, remove one to swap' : `${selected.length} of ${MAX} selected`}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((v) => {
                    const on = ids.includes(v.id);
                    const disabled = !on && full;
                    return (
                      <button
                        key={v.id}
                        onClick={() => toggle(v.id)}
                        disabled={disabled}
                        data-cursor="hover"
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
                          on ? 'border-red bg-red/10' : 'border-white/10 hover:border-white/30',
                          disabled && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                          {v.images[0] && (
                            <Image src={carImage(v.images[0], 160)} alt={`${v.make} ${v.model}`} fill placeholder="blur" blurDataURL={BLUR} unoptimized sizes="64px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[11px] uppercase tracking-wide text-white">
                            {v.year} {v.make} {v.model}
                          </p>
                          <p className="truncate text-xs text-graphite-400">{v.variant}</p>
                          <p className="mt-0.5 text-xs text-red">{formatPrice(v.price)}</p>
                        </div>
                        <span
                          className={cn(
                            'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                            on ? 'bg-red text-white' : 'border border-white/20 text-graphite-300',
                          )}
                        >
                          {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {results.length === 0 && (
                  <div className="py-16 text-center text-sm text-graphite-400">No cars match that search.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
