import { getHomepageCards, getHeroVehicle, getFilterMeta } from '@/lib/inventory/public';
import { Hero } from '@/components/home/hero';
import { QuickSearch } from '@/components/home/quick-search';
import { AwardsMarquee } from '@/components/home/awards-marquee';
import { FeaturedInventory } from '@/components/home/featured-inventory';
import { ScrollMarquee } from '@/components/home/scroll-marquee';
import { BrandPillars } from '@/components/home/brand-pillars';
import { Testimonials } from '@/components/home/testimonials';
import { FomoTeasers } from '@/components/home/fomo-teasers';
import { CtaBand } from '@/components/layout/cta-band';

export default async function HomePage() {
  const [heroVehicle, homepageCards, filterMeta] = await Promise.all([
    getHeroVehicle(),
    getHomepageCards(),
    getFilterMeta(),
  ]);
  return (
    <>
      <Hero vehicle={heroVehicle} />
      <QuickSearch meta={filterMeta} />
      <AwardsMarquee />
      <FeaturedInventory vehicles={homepageCards} />
      <ScrollMarquee />
      <BrandPillars />
      <Testimonials />
      <FomoTeasers />
      <CtaBand
        secondary={{ label: 'Get a Cash Offer', href: '/sell-your-car' }}
        tertiary={{ label: 'Apply for Finance', href: '/finance' }}
      />
    </>
  );
}
