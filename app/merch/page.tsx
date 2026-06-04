import type { Metadata } from 'next';
import { ArrowDown } from 'lucide-react';
import { merchProducts } from '@/data/merch';
import { PageHero } from '@/components/layout/page-hero';
import { MerchStore } from '@/components/merch/merch-store';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'UB Drip Merch, Uncle Bobby x Mit-Mak',
  description:
    'Shop UB Drip, the official Uncle Bobby and Mit-Mak Motors apparel and accessories. Caps, tees, hoodies, track jackets and more. Wear the brand.',
  alternates: { canonical: '/merch' },
};

export default function MerchPage() {
  return (
    <>
      <PageHero
        eyebrow="UB Drip Store"
        title="Wear the Brand"
        description="The official Uncle Bobby x Mit-Mak Motors drip, caps, tees, hoodies, track jackets and more. Built for the culture, repped on every street."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Merch', href: '/merch' }]}
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
      >
        <a
          href="#store"
          data-cursor="hover"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
        >
          Shop the Collection <ArrowDown className="h-4 w-4" />
        </a>
      </PageHero>

      <div id="store" className="scroll-mt-24">
        <MerchStore products={merchProducts} />
      </div>

      <CtaBand
        eyebrow="UB Drip"
        title="Never miss a drop"
        description="New caps, tees and hoodies land all the time. Join the list and be first in line for every release and FOMO Zone reward."
        primary={{ label: 'Get Drop Alerts', href: '/newsletter' }}
        secondary={{ label: 'FOMO Zone', href: '/fomo-zone' }}
      />
    </>
  );
}
