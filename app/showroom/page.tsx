import type { Metadata } from 'next';
import type { SortKey, VehicleFilters, BodyType } from '@/types';
import { allBodyTypes, allMakes, vehicleCards, filterMeta } from '@/data/vehicles';
import { PageHero } from '@/components/layout/page-hero';
import { ShowroomClient } from '@/components/showroom/showroom-client';

export const metadata: Metadata = {
  title: 'Showroom, Premium Pre-Owned Cars',
  description:
    'Browse Mit-Mak Motors’ full showroom of inspected, reconditioned premium pre-owned cars. Filter by make, model, price, body type, drive and more. Delivered free nationwide.',
  alternates: { canonical: '/showroom' },
};

const VALID_SORTS: SortKey[] = ['newest', 'price-asc', 'price-desc', 'year-desc', 'mileage-asc'];

export default function ShowroomPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const typeParam = typeof searchParams.type === 'string' ? searchParams.type : '';
  const makeParam = typeof searchParams.make === 'string' ? searchParams.make : '';
  const modelParam = typeof searchParams.model === 'string' ? searchParams.model : '';
  const qParam = typeof searchParams.q === 'string' ? searchParams.q : '';
  const maxPriceParam = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : '';
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : '';

  const allModels = Object.values(filterMeta.modelsByMake).flat();
  const maxPriceNum = Number(maxPriceParam);

  const initialFilters: Partial<VehicleFilters> = {
    q: qParam,
    bodyType: allBodyTypes.includes(typeParam as BodyType) ? [typeParam as BodyType] : [],
    make: allMakes.includes(makeParam) ? [makeParam] : [],
    model: allModels.includes(modelParam) ? [modelParam] : [],
    maxPrice: maxPriceParam && Number.isFinite(maxPriceNum) && maxPriceNum > 0 ? maxPriceNum : null,
  };
  const initialSort: SortKey = VALID_SORTS.includes(sortParam as SortKey) ? (sortParam as SortKey) : 'newest';

  return (
    <>
      <PageHero
        eyebrow="The Showroom"
        title="Find Your Next Car"
        description="Every vehicle inspected, reconditioned and ready to drive, then delivered free, anywhere in South Africa. Filter, compare and reserve in minutes."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Showroom', href: '/showroom' }]}
        image="https://images.unsplash.com/photo-1767907571229-01cf4ba03590?auto=format&fit=crop&w=1600&q=80"
      />
      <ShowroomClient cards={vehicleCards} meta={filterMeta} initialFilters={initialFilters} initialSort={initialSort} />
    </>
  );
}
