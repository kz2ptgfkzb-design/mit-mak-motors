import type { Metadata } from 'next';
import { vehicleCards } from '@/data/vehicles';
import { PageHero } from '@/components/layout/page-hero';
import { CompareClient } from '@/components/compare/compare-client';

export const metadata: Metadata = {
  title: 'Compare Vehicles',
  description:
    'Line up to four cars from the Mit-Mak Motors showroom side by side, price, spec, power, mileage and more, then reserve the one that fits.',
  alternates: { canonical: '/compare' },
};

export default function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const known = new Set(vehicleCards.map((v) => v.id));
  const initialIds = (typeof searchParams.ids === 'string' ? searchParams.ids : '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => known.has(s))
    .slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare Vehicles"
        description="Line up to four cars side by side, price, spec, power and mileage, then reserve the one that fits. Add cars from the showroom or search below."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Compare', href: '/compare' }]}
        image="https://img.autotrader.co.za/47470545/Crop1024x576.jpg"
      />
      <CompareClient cards={vehicleCards} initialIds={initialIds} />
    </>
  );
}
