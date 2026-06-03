import type { Metadata } from 'next';
import Image from 'next/image';
import { Truck, ShieldCheck, Trophy, Star, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { stats } from '@/data/awards';
import { PageHero } from '@/components/layout/page-hero';
import { AwardsMarquee } from '@/components/home/awards-marquee';
import { CtaBand } from '@/components/layout/cta-band';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { Counter } from '@/components/ui/counter';

export const metadata: Metadata = {
  title: 'About — Why Mit-Mak',
  description:
    'Mit-Mak Motors: Pretoria’s most-awarded pre-owned dealership. The story behind Trusted. Awarded. Unmatched. — and why 12,000+ South Africans chose us.',
  alternates: { canonical: '/about' },
};

const values = [
  { icon: Truck, title: 'Delivered Free', text: 'Every car, every province — door-to-door at no cost. We own the logistics so you never have to travel.' },
  { icon: ShieldCheck, title: 'Inspected & Reconditioned', text: 'A 212-point process signed off by three specialists. If it’s below standard, it’s fixed before it’s listed.' },
  { icon: Trophy, title: 'Awarded', text: 'AutoTrader Dealer of the Year, 2024 and 2025. Recognised for the cars, the service and the experience.' },
  { icon: Star, title: '#1 on HelloPeter', text: 'Seven years at the top, 9.7 / 10 across thousands of verified reviews. Reputation you can audit.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Mit-Mak"
        title="Trusted. Awarded. Unmatched."
        description="What started as a single bay in Pretoria North is now South Africa’s most-awarded pre-owned dealership — built on one stubborn idea: tell the truth, fix the car properly, deliver it free."
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
                  cars one at a time — and refused to let a single one leave below standard.
                </p>
                <p>
                  That obsession scaled. Today we run six branches across Gerrit Maritz and Rachel de Beer Streets in
                  Pretoria North, a dedicated reconditioning hub, and a delivery operation that reaches all nine
                  provinces — free.
                </p>
                <p>
                  The awards followed the standard, not the other way around. <span className="text-white">Trusted. Awarded. Unmatched.</span> isn’t a slogan — it’s the order we earned it in.
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

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="What We Stand For" title="The Mit-Mak Standard" align="center" className="mx-auto" />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-850 p-6 transition-colors hover:border-white/20">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red/15 text-red">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg uppercase tracking-tight text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-400">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AwardsMarquee />

      {/* Team teaser */}
      <section className="py-16 lg:py-24">
        <div className="container flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-ink-850 to-ink-900 p-8 sm:flex-row sm:items-center lg:p-12">
          <div>
            <SectionHeading eyebrow="The People" title="Meet the team behind the standard" />
          </div>
          <Link href="/staff" data-cursor="hover" className="group inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-red px-7 font-display text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow">
            Meet the Team
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <CtaBand secondary={{ label: 'Get a Cash Offer', href: '/sell-your-car' }} />
    </>
  );
}
