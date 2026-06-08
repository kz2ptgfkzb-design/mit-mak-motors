'use client';

import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { useRouter } from 'next/navigation';
import { CarFinder, type FinderSelection } from '@/components/showroom/car-finder';
import type { FilterMeta } from '@/components/showroom/filter-bar';
import { Reveal } from '@/components/ui/reveal';
import { Eyebrow } from '@/components/ui/section-heading';

export function QuickSearch({ meta }: { meta: FilterMeta }) {
  const router = useRouter();

  function go(sel: FinderSelection) {
    const parts: string[] = [];
    if (sel.bodyType) parts.push(`type=${encodeURIComponent(sel.bodyType)}`);
    if (sel.make) parts.push(`make=${encodeURIComponent(sel.make)}`);
    if (sel.model) parts.push(`model=${encodeURIComponent(sel.model)}`);
    if (sel.variant) parts.push(`q=${encodeURIComponent(sel.variant)}`);
    if (sel.maxPrice) parts.push(`maxPrice=${sel.maxPrice}`);
    const qs = parts.join('&');
    router.push(qs ? `/showroom?${qs}` : '/showroom');
  }

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink-950 py-20 lg:py-28">
      {/* Showroom backdrop, darkened so the finder stays clean and legible */}
      <Image
        src="https://images.unsplash.com/photo-1716702528916-18c7a8c1ecde?auto=format&fit=crop&w=1600&q=80"
        alt=""
        fill
        aria-hidden
        placeholder="blur"
        blurDataURL={BLUR}
        sizes="100vw"
        className="pointer-events-none select-none object-cover object-center opacity-[0.55]"
      />
      <div className="pointer-events-none absolute inset-0 bg-ink-950/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/40 to-ink-950" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-30 [background-size:54px_54px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-red/40 to-transparent" />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow center>Start Your Search</Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-anton text-4xl uppercase leading-[0.92] tracking-condensed sm:text-5xl md:text-6xl">
            Find Your <span className="text-red">Perfect</span> Car
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-graphite-300">
              Filter by type, make, model and budget, or tap a body style to jump straight into the showroom.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mx-auto mt-12 max-w-5xl">
          <CarFinder meta={meta} onSearch={go} />
        </Reveal>
      </div>
    </section>
  );
}
