import { IgnitionIntro } from '@/components/home/ignition-intro';
import { Hero } from '@/components/home/hero';
import { AwardsMarquee } from '@/components/home/awards-marquee';
import { FeaturedInventory } from '@/components/home/featured-inventory';
import { ScrollMarquee } from '@/components/home/scroll-marquee';
import { BrandPillars } from '@/components/home/brand-pillars';
import { Testimonials } from '@/components/home/testimonials';
import { FomoTeasers } from '@/components/home/fomo-teasers';
import { CtaBand } from '@/components/layout/cta-band';

export default function HomePage() {
  return (
    <>
      <IgnitionIntro />
      <Hero />
      <AwardsMarquee />
      <FeaturedInventory />
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
