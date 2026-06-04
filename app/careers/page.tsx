import type { Metadata } from 'next';
import { MapPin, Clock, ArrowUpRight, Zap, TrendingUp, HeartHandshake, Gift } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Careers, Join the Team',
  description: 'Careers at Mit-Mak Motors. Join Pretoria’s fastest-growing, most-awarded pre-owned dealership. Sales, finance, reconditioning, delivery and marketing roles.',
  alternates: { canonical: '/careers' },
};

const roles = [
  { title: 'Sales Executive', branch: 'Flagship, Gerrit Maritz', type: 'Full-time', blurb: 'Own the floor. Help customers find the right car and close with honesty and pace.' },
  { title: 'F&I Business Manager', branch: 'Finance House', type: 'Full-time', blurb: 'Structure finance and insurance, secure the best bank rates, protect the deal.' },
  { title: 'Reconditioning Technician', branch: 'Flagship, Gerrit Maritz', type: 'Full-time', blurb: 'Run cars through the 212-point process. Detail, repair, sign off, to the standard.' },
  { title: 'Nationwide Delivery Driver', branch: 'Flagship, Gerrit Maritz', type: 'Full-time', blurb: 'Get reconditioned cars to customers’ doors across all nine provinces, spotless.' },
  { title: 'Digital Marketing Coordinator', branch: 'Flagship, Gerrit Maritz', type: 'Full-time', blurb: 'Run the content, the socials and the FOMO Zone. Make the brand impossible to ignore.' },
  { title: 'Customer Experience Agent', branch: 'Premium & Performance', type: 'Full-time', blurb: 'Be the reason we stay #1 on HelloPeter. Fast, warm, relentless follow-through.' },
];

const perks = [
  { icon: TrendingUp, title: 'Real growth', text: 'We promote from within. Most managers started on the floor.' },
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
          <SectionHeading eyebrow="Open Roles" title="Current Vacancies" />
          <div className="mt-12 space-y-4">
            {roles.map((role, i) => (
              <Reveal key={role.title} delay={i * 0.04}>
                <a
                  href={`mailto:careers@mitmakmotors.co.za?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
                  data-cursor="hover"
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-850 p-6 transition-colors hover:border-red/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-tight text-white">{role.title}</h3>
                    <p className="mt-1 text-sm text-graphite-400">{role.blurb}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-graphite-500">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {role.branch}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {role.type}</span>
                    </div>
                  </div>
                  <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white/[0.06] px-5 font-display text-xs uppercase tracking-wide text-white transition-colors group-hover:bg-red">
                    Apply <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-sm text-graphite-500">
            Don’t see your role? Send your CV to{' '}
            <a href="mailto:careers@mitmakmotors.co.za" className="text-red underline underline-offset-4">careers@mitmakmotors.co.za</a>, we’re always keen to meet good people.
          </p>
        </div>
      </section>
    </>
  );
}
