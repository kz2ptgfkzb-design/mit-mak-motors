import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { stats } from '@/data/awards';
import { locations } from '@/data/locations';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/page-hero';
import { AwardsMarquee } from '@/components/home/awards-marquee';
import { CtaBand } from '@/components/layout/cta-band';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { Counter } from '@/components/ui/counter';

export const metadata: Metadata = {
  title: 'About, Why Mit-Mak',
  description:
    'Mit-Mak Motors: Pretoria’s most-awarded pre-owned dealership. The story behind Trusted. Awarded. Unmatched., and why 12,000+ South Africans chose us.',
  alternates: { canonical: '/about' },
};

// Alternating "why us" series, recreated from the real Mit-Mak About page in
// our premium theme. Each visual is a real premium car from live inventory and
// links to its listing. Extend this array as more sections come in.
const whyMitMak = [
  {
    eyebrow: 'The Mission',
    title: 'Why Choose Mit-Mak Motors',
    body: [
      'We are changing the way South Africans buy used cars. Browse and buy any car in our showroom online, and we deliver it to your door, anywhere in the country, for free.',
      'We buy only the best cars on the market, then thoroughly inspect and fully recondition each one to meet our standard. We are incredibly selective about what we put in front of our clients.',
    ],
    image: 'https://img.autotrader.co.za/47544621/Crop1024x576.jpg',
    imageAlt: '2024 Mercedes-Benz S-Class at Mit-Mak Motors',
    href: '/vehicles/2024-mercedes-benz-s-class-s500-l-4matic-amg-line',
    carLabel: 'Mercedes-Benz S-Class',
  },
  {
    eyebrow: 'Free Home Delivery',
    title: 'Did We Mention Free Home Delivery?',
    body: [
      'There is no need to leave home to collect your Mit-Mak Motors vehicle. We deliver to your front door for free, at a time that suits you, any day of the week, nationwide.',
      'One of our delivery specialists unloads your car and walks you through its features before handing over the keys.',
    ],
    image: 'https://img.autotrader.co.za/47517076/Crop1024x576.jpg',
    imageAlt: '2019 Land Rover Range Rover Velar at Mit-Mak Motors',
    href: '/vehicles/2019-land-rover-range-rover-velar-d180-r-dynamic-se',
    carLabel: 'Range Rover Velar',
  },
  {
    eyebrow: 'Pre-Delivery Inspection',
    title: 'Intensive Pre-Delivery Inspection',
    body: [
      'Every car we sell passes an intensive pre-delivery inspection plus a Dekra / VTS (Vehicle Technical Solutions) roadworthy. Our mechanics check everything from the lights, wipers and radio to the sat nav and cooling system.',
      'We invest heavily in reconditioning every car before it is listed, so if anything needs repairing, it is already handled.',
    ],
    image: 'https://img.autotrader.co.za/47470885/Crop1024x576.jpg',
    imageAlt: '2015 BMW M4 Coupe at Mit-Mak Motors',
    href: '/vehicles/2015-bmw-m4-coupe-auto-2',
    carLabel: 'BMW M4 Coupe',
  },
  {
    eyebrow: 'Master Technicians',
    title: 'Test-Driven by Our Master Technicians',
    body: [
      'Our master technicians test drive every car to check engine performance, steering and brakes, and to confirm there are no mechanical problems.',
      'If we find anything we are not happy with, we fix it or we do not sell it. Easy as that.',
    ],
    image: 'https://img.autotrader.co.za/47097831/Crop1024x576.jpg',
    imageAlt: '2021 Audi A3 Sedan S Line at Mit-Mak Motors',
    href: '/vehicles/2021-audi-a3-sedan-35tfsi-s-line',
    carLabel: 'Audi A3 S Line',
  },
  {
    eyebrow: 'Quality Standards',
    title: 'The Mit-Mak Quality Standard',
    body: [
      'We are incredibly selective about the cars we buy, purchasing only the best used cars on the market.',
      'Every car is restored to the manufacturer settings and checked to make sure it meets all safety standards before it reaches you.',
    ],
    image: 'https://img.autotrader.co.za/47129251/Crop1024x576.jpg',
    imageAlt: '2021 BMW 3 Series M Sport at Mit-Mak Motors',
    href: '/vehicles/2021-bmw-3-series-318i-m-sport-2',
    carLabel: 'BMW 3 Series M Sport',
  },
  {
    eyebrow: 'Only the Best',
    title: 'Only the Best Vehicles Make the Cut',
    body: [
      'Not every car on the road can become a Mit-Mak Motors pre-loved vehicle. Quality, reliability and peace of mind drive our selection, so some cars simply do not make the cut.',
      'When you buy your next dream car at Mit-Mak Motors you receive not only the best service, but the best car your money can buy, thanks to our careful selection process.',
    ],
    image: 'https://img.autotrader.co.za/46961221/Crop1024x576.jpg',
    imageAlt: '2019 BMW X6 M50d at Mit-Mak Motors',
    href: '/vehicles/2019-bmw-x6-m50d-2',
    carLabel: 'BMW X6 M50d',
  },
];

// The three customer-facing branches shown on the source About page
// (590 Gerrit Maritz, 446 + 565 Rachel de Beer), pulled from real location data.
const branches = locations.filter((l) =>
  ['gerrit-maritz-flagship', 'rachel-de-beer-premium', 'gerrit-maritz-finance'].includes(l.id),
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Mit-Mak"
        title="Trusted. Awarded. Unmatched."
        description="What started as a single bay in Pretoria North is now South Africa’s most-awarded pre-owned dealership, built on one stubborn idea: tell the truth, fix the car properly, deliver it free."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
      />

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1400&q=80" alt="Inside the Mit-Mak reconditioning workshop" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Our Story" title="From one bay to six branches" />
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-graphite-300">
                <p>
                  Mit-Mak Motors was founded on the floor, not in a boardroom. Mike Makua bought, prepped and sold
                  cars one at a time, and refused to let a single one leave below standard.
                </p>
                <p>
                  That obsession scaled. Today we run six branches across Gerrit Maritz and Rachel de Beer Streets in
                  Pretoria North, a dedicated reconditioning hub, and a delivery operation that reaches all nine
                  provinces, free.
                </p>
                <p>
                  The awards followed the standard, not the other way around. <span className="text-white">Trusted. Awarded. Unmatched.</span> isn’t a slogan, it’s the order we earned it in.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-ink-900 py-14">
        <div className="container grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.id} className="text-center">
              <div className="font-anton text-5xl leading-none text-white lg:text-6xl">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm text-graphite-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Mit-Mak, alternating feature series */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            eyebrow="What We Stand For"
            title="The Mit-Mak Standard"
            align="center"
            className="mx-auto max-w-2xl"
          />
          <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
            {whyMitMak.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <div key={s.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Reveal className={cn('relative', flip && 'lg:order-2')}>
                    <Link href={s.href} data-cursor="hover" className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={s.image}
                          alt={s.imageAlt}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/70 px-3 py-1.5 backdrop-blur">
                          <span className="font-display text-[11px] uppercase tracking-wide text-white">{s.carLabel}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-red transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                  <Reveal delay={0.1} className={cn(flip && 'lg:order-1')}>
                    <span aria-hidden className="block font-anton text-5xl leading-none text-white/10 lg:text-6xl">
                      {`0${i + 1}`}
                    </span>
                    <p className="mt-4 font-display text-[11px] uppercase tracking-[0.2em] text-red">{s.eyebrow}</p>
                    <h3 className="mt-3 font-display text-3xl uppercase leading-[0.95] tracking-tight text-white lg:text-4xl">
                      {s.title}
                    </h3>
                    <div className="mt-5 space-y-4 leading-relaxed text-graphite-300">
                      {s.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AwardsMarquee />

      {/* Visit us, branches */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            eyebrow="Come See Us"
            title="We are looking forward to seeing you"
            align="center"
            className="mx-auto max-w-2xl"
          />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-center text-graphite-300">
              Visit us at one of our Pretoria North branches, or stay home and let us deliver your dream car to your door,
              anywhere in South Africa.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-850 p-6 transition-colors hover:border-white/20">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-display text-[11px] uppercase tracking-[0.16em] text-red">{b.kind}</p>
                  <h3 className="mt-1 font-display text-lg uppercase tracking-tight text-white">{b.street}</h3>
                  <p className="mt-1 text-sm text-graphite-400">
                    {b.suburb}, {b.city}
                  </p>
                  <div className="mt-5 flex items-center gap-5 text-xs">
                    <a
                      href={`tel:${b.phone.replace(/\s/g, '')}`}
                      className="font-display uppercase tracking-wide text-white transition-colors hover:text-red"
                    >
                      Call
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group inline-flex items-center gap-1 font-display uppercase tracking-wide text-red"
                    >
                      Directions
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              data-cursor="hover"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
            >
              All Branches + Map
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/staff"
              data-cursor="hover"
              className="inline-flex h-12 items-center rounded-full border border-white/15 px-7 font-display text-xs uppercase tracking-wide text-white transition-colors hover:border-white/40"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        primary={{ label: 'Online Finance Application', href: '/finance' }}
        secondary={{ label: 'Get a Free Credit Score', href: '/finance#credit-score' }}
        tertiary={{ label: 'Get a Cash Offer', href: '/sell-your-car' }}
      />
    </>
  );
}
