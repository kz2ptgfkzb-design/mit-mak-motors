import type { Metadata } from 'next';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { staffDepartments, staffCount } from '@/data/staff';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'Our Team, Meet the People Behind Mit-Mak',
  description:
    'Meet the Mit-Mak Motors team, the sales, finance, buying, reconditioning, workshop and support people behind South Africa’s most-awarded pre-owned dealership.',
  alternates: { canonical: '/staff' },
};

function initials(name: string) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

const [leadership, ...departments] = staffDepartments;
const deptCount = staffDepartments.length;

function Photo({ image, name, className }: { image: string; name: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-graphite-800/50 to-ink-900 ${className ?? ''}`}>
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          placeholder="blur"
          blurDataURL={BLUR}
          sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 18vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-anton text-3xl text-graphite-600">
          {initials(name)}
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="The People"
        title="Meet the Team"
        description="Awards don’t answer WhatsApps at 7pm, people do. Meet the team that earned us 7 years at #1 on HelloPeter, every floor, every department."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Our Team', href: '/staff' }]}
        image="https://img.autotrader.co.za/47208073/Crop1024x576.jpg"
      />

      {/* Leadership */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="Leadership" title="The people steering the standard" />
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {leadership.people.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06}>
                <div className="group">
                  <Photo image={p.image} name={p.name} className="aspect-[4/5]" />
                  <h3 className="mt-4 font-display text-lg uppercase leading-tight tracking-tight text-white">{p.name}</h3>
                  <p className="mt-0.5 font-display text-xs uppercase tracking-[0.16em] text-red">{p.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Headcount strip */}
      <section className="border-y border-white/10 bg-ink-900 py-10">
        <div className="container flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
          <div>
            <span className="font-anton text-4xl text-white lg:text-5xl">{staffCount}</span>
            <p className="mt-1 font-display text-[11px] uppercase tracking-[0.18em] text-graphite-400">Team Members</p>
          </div>
          <span className="hidden h-10 w-px bg-white/10 sm:block" />
          <div>
            <span className="font-anton text-4xl text-white lg:text-5xl">{deptCount}</span>
            <p className="mt-1 font-display text-[11px] uppercase tracking-[0.18em] text-graphite-400">Departments</p>
          </div>
          <span className="hidden h-10 w-px bg-white/10 sm:block" />
          <div>
            <span className="font-anton text-4xl text-white lg:text-5xl">5</span>
            <p className="mt-1 font-display text-[11px] uppercase tracking-[0.18em] text-graphite-400">Sales Floors</p>
          </div>
        </div>
      </section>

      {/* Departments */}
      {departments.map((dept) => (
        <section key={dept.title} className="py-12 lg:py-16">
          <div className="container">
            <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
              <h3 className="font-display text-xl uppercase tracking-tight text-white lg:text-2xl">{dept.title}</h3>
              <span className="shrink-0 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-500">
                {dept.people.length} {dept.people.length === 1 ? 'person' : 'people'}
              </span>
            </div>
            <Reveal>
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {dept.people.map((p) => (
                  <div key={p.name + p.role} className="group">
                    <Photo image={p.image} name={p.name} className="aspect-square" />
                    <h4 className="mt-3 font-display text-[13px] uppercase leading-tight tracking-tight text-white">{p.name}</h4>
                    <p className="mt-0.5 text-xs leading-snug text-graphite-400">{p.role}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

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
