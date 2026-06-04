import type { Metadata } from 'next';
import { MapPin, Clock, Briefcase, Banknote, Zap, TrendingUp, HeartHandshake, Gift } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { CareersForm } from '@/components/careers/careers-form';

export const metadata: Metadata = {
  title: 'Careers, Join the Team',
  description:
    'Careers at Mit-Mak Motors. Join Pretoria’s fastest-growing, most-awarded pre-owned dealership. Now hiring Sales Executive / CRM / Mechanic in Pretoria North.',
  alternates: { canonical: '/careers' },
};

const POSITION = { title: 'Sales Executive / CRM / Mechanic', location: 'Pretoria North', type: 'Full Time', salary: 'Market Related' };

const perks = [
  { icon: TrendingUp, title: 'Real growth', text: 'We promote from within. Plenty of our managers started on the floor.' },
  { icon: Zap, title: 'Fast culture', text: 'No red tape. Good ideas ship the same week.' },
  { icon: HeartHandshake, title: 'Honest values', text: 'Tell the truth, do right by the customer. Every time.' },
  { icon: Gift, title: 'Strong rewards', text: 'Competitive base, real commission, staff car deals.' },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Work With Us"
        title="Build the Standard"
        description="We’re Pretoria’s fastest-growing, most-awarded pre-owned dealership, and we’re hiring people who care as much as we do."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="Why Mit-Mak" title="A place to actually grow" align="center" className="mx-auto" />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-850 p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base uppercase tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-graphite-400">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="Open Roles" title="Available Positions" />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-2xl border border-white/10 bg-ink-850 p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red/15 px-3 py-1 font-display text-[11px] uppercase tracking-wide text-red">
                    <Briefcase className="h-3.5 w-3.5" /> Now Hiring
                  </span>
                  <h3 className="mt-5 font-display text-2xl uppercase leading-tight tracking-tight text-white">{POSITION.title}</h3>
                  <ul className="mt-6 space-y-3 text-sm text-graphite-300">
                    <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-red" /> {POSITION.location}</li>
                    <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-red" /> {POSITION.type}</li>
                    <li className="flex items-center gap-2.5"><Banknote className="h-4 w-4 text-red" /> {POSITION.salary}</li>
                  </ul>
                  <p className="mt-6 text-sm leading-relaxed text-graphite-400">
                    A versatile role across our Pretoria North floor, spanning sales, CRM and the workshop. We want someone who
                    tells the truth, moves fast and looks after the customer. Apply with your CV and we will be in touch.
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
                <CareersForm position={POSITION.title} />
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-graphite-500">
            Don’t see your role? Email your CV to{' '}
            <a href="mailto:careers@mitmakmotors.co.za" className="text-red underline underline-offset-4">careers@mitmakmotors.co.za</a>, we’re
            always keen to meet good people.
          </p>
        </div>
      </section>
    </>
  );
}
