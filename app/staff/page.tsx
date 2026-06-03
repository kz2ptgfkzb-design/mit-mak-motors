import type { Metadata } from 'next';
import { staff } from '@/data/content';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'Our Staff — Meet the Team',
  description: 'The people behind Mit-Mak Motors’ 7-year #1 HelloPeter streak — sales, finance, reconditioning and customer experience experts across six branches.',
  alternates: { canonical: '/staff' },
};

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="The People"
        title="Meet the Team"
        description="Awards don’t answer WhatsApps at 7pm — people do. Meet the team that earned us 7 years at #1 on HelloPeter."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Staff', href: '/staff' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-850 p-6 transition-colors hover:border-white/20">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red to-red-800 font-anton text-xl text-white shadow-glow-sm">
                    {initials(member.name)}
                  </span>
                  <div>
                    <h3 className="font-display text-lg uppercase leading-tight tracking-tight text-white">{member.name}</h3>
                    <p className="text-sm text-red">{member.role}</p>
                  </div>
                </div>
                <p className="mt-3 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-500">{member.branch}</p>
                <p className="mt-3 text-sm leading-relaxed text-graphite-400">{member.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Join Us"
        title="Think you’ve got what it takes?"
        description="We’re always looking for people who tell the truth, move fast and care about the customer. Come build the standard with us."
        primary={{ label: 'See Open Roles', href: '/careers' }}
        secondary={{ label: 'Contact Us', href: '/contact' }}
      />
    </>
  );
}
