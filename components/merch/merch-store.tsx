'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MerchProduct } from '@/data/merch';

export function MerchStore({ products }: { products: MerchProduct[] }) {
  const { list, counts } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    const list = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return { list, counts };
  }, [products]);

  const [active, setActive] = useState<string>('All');
  const shown = active === 'All' ? products : products.filter((p) => p.category === active);

  function Pill({ id, label, count }: { id: string; label: string; count: number }) {
    return (
      <button
        onClick={() => setActive(id)}
        data-cursor="hover"
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[11px] uppercase tracking-wide transition-colors',
          active === id ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-300 hover:border-white/40 hover:text-white',
        )}
      >
        {label}
        <span className={cn('text-[10px]', active === id ? 'text-white/70' : 'text-graphite-500')}>{count}</span>
      </button>
    );
  }

  return (
    <section className="container py-12 lg:py-16">
      {/* Category filter */}
      <div className="sticky top-20 z-20 -mx-4 mb-9 flex flex-wrap gap-2.5 bg-ink-950/80 px-4 py-3 backdrop-blur-md lg:top-24">
        <Pill id="All" label="All" count={products.length} />
        {list.map((c) => (
          <Pill key={c} id={c} label={c} count={counts[c]} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <a
            key={p.name + p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-graphite-800/40 to-ink-900 transition-colors group-hover:border-white/25">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-display text-[9px] uppercase tracking-widest text-graphite-200 backdrop-blur">
                {p.category}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-gradient-to-t from-ink-950/85 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-red px-3 py-1.5 font-display text-[10px] uppercase tracking-wide text-white">
                  Shop <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
            <h3 className="mt-3 font-display text-[13px] uppercase leading-tight tracking-tight text-white">{p.name}</h3>
            <span className="mt-1 font-display text-sm text-red">{p.price}</span>
          </a>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center text-graphite-400">
          <SearchX className="h-8 w-8" />
          <p className="mt-3 text-sm">Nothing in this category right now.</p>
        </div>
      )}
    </section>
  );
}
