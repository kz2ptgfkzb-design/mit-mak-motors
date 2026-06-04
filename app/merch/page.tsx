import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { merchProducts, merchStoreUrl } from '@/data/merch';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'UB Drip Merch, Uncle Bobby x Mit-Mak',
  description:
    'Shop UB Drip, the official Uncle Bobby and Mit-Mak Motors apparel and accessories. Caps, tees, hoodies, track jackets and more. Wear the brand.',
  alternates: { canonical: '/merch' },
};

const counts = merchProducts.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});
const categories = Array.from(new Set(merchProducts.map((p) => p.category))).sort((a, b) => counts[b] - counts[a]);

export default function MerchPage() {
  return (
    <>
      <PageHero
        eyebrow="UB Drip"
        title="Wear the Brand"
        description="The official Uncle Bobby x Mit-Mak Motors drip, caps, tees, hoodies, track jackets and more. Built for the culture, repped on every street."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Merch', href: '/merch' }]}
      >
        <a
          href={merchStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
        >
          Shop the full store <ArrowUpRight className="h-4 w-4" />
        </a>
      </PageHero>

      {categories.map((cat) => {
        const items = merchProducts.filter((p) => p.category === cat);
        return (
          <section key={cat} className="py-12 lg:py-16">
            <div className="container">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <h2 className="font-display text-xl uppercase tracking-tight text-white lg:text-2xl">{cat}</h2>
                <span className="shrink-0 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-500">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <Reveal>
                <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <a
                      key={p.name + p.href}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-graphite-800/40 to-ink-900">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 22vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <h3 className="mt-3 font-display text-[13px] uppercase leading-tight tracking-tight text-white">{p.name}</h3>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="font-display text-sm text-red">{p.price}</span>
                        <span className="inline-flex items-center gap-1 font-display text-[10px] uppercase tracking-wide text-graphite-400 transition-colors group-hover:text-white">
                          Shop <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <CtaBand
        eyebrow="UB Drip"
        title="Rep the brand"
        description="Every cap, tee and hoodie ships from Pretoria. Browse the full collection and check out securely on the UB Drip store."
        primary={{ label: 'Shop the Full Store', href: merchStoreUrl, external: true }}
        secondary={{ label: 'Back to FOMO Zone', href: '/fomo-zone' }}
      />
    </>
  );
}
