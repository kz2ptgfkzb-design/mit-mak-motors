import type { Metadata } from 'next';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { Calendar, Monitor, Users, GraduationCap, ArrowDown, ShieldCheck, Infinity as InfinityIcon, ArrowUpRight } from 'lucide-react';
import { masterclassCourses, masterclassCredentials, masterclassSkills, masterclassInstructor } from '@/data/masterclass';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { MasterclassEnquiry } from '@/components/masterclass/masterclass-enquiry';

export const metadata: Metadata = {
  title: 'Mit-Mak Masterclass, Learn From the Dealer of the Year',
  description:
    'Learn the exact playbook behind Mit-Mak Motors, sales, marketing, F&I and operations, taught by Bobby Petkov. Seminars, online courses and one-on-one mentorship.',
  alternates: { canonical: '/masterclass' },
};

function formatIcon(format: string) {
  if (format.includes('Online Course')) return GraduationCap;
  if (format.includes('Online')) return Monitor;
  if (format.includes('Live')) return Calendar;
  return Users;
}

export default function MasterclassPage() {
  return (
    <>
      <PageHero
        eyebrow="Mit-Mak Masterclass"
        title="Learn From the Dealer of the Year"
        description="The exact playbook behind 200+ cars a month, sales, marketing, F&I and operations, taught straight by Bobby Petkov. No gatekeeping."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Masterclass', href: '/masterclass' }]}
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
      >
        <a
          href="#courses"
          data-cursor="hover"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
        >
          View the Courses <ArrowDown className="h-4 w-4" />
        </a>
      </PageHero>

      {/* Credentials */}
      <section className="border-b border-white/10 bg-ink-900 py-10">
        <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {masterclassCredentials.map((c, i) => (
            <span key={c} className="inline-flex items-center gap-3">
              {i > 0 && <span className="hidden text-graphite-700 sm:inline">·</span>}
              <span className="font-display text-[11px] uppercase tracking-[0.16em] text-graphite-300">{c}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section className="py-16 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-graphite-800/40 to-ink-900">
              <Image src={masterclassInstructor.image} alt={masterclassInstructor.name} fill placeholder="blur" blurDataURL={BLUR} sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="font-anton text-2xl uppercase tracking-tight text-white">{masterclassInstructor.name}</p>
                <p className="font-display text-[11px] uppercase tracking-[0.16em] text-red">{masterclassInstructor.role}</p>
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Your Instructor" title="Taught by Bobby Petkov" />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-graphite-300 md:text-lg">{masterclassInstructor.bio}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What you learn */}
      <section className="border-t border-white/10 py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="The Curriculum" title="What You Will Learn" align="center" className="mx-auto" />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {masterclassSkills.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-850 p-6">
                  <span className="font-anton text-3xl text-white/15">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-base uppercase tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-400">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="scroll-mt-24 border-t border-white/10 py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow="The Programmes" title="Seminars, Courses & Mentorship" />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {masterclassCourses.map((c) => {
              const Icon = formatIcon(c.format);
              return (
                <div key={c.title} className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-850 p-7 transition-colors hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red/15 px-3 py-1 font-display text-[10px] uppercase tracking-wide text-red">
                      <Icon className="h-3.5 w-3.5" /> {c.format}
                    </span>
                    <span className="font-anton text-xl text-white">{c.price}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl uppercase leading-tight tracking-tight text-white">{c.title}</h3>
                  <p className="mt-1 font-display text-[11px] uppercase tracking-wide text-graphite-500">{c.duration}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite-400">{c.blurb}</p>
                  <a
                    href="#enquire"
                    data-cursor="hover"
                    className="group mt-6 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-red"
                  >
                    Register Interest
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            <span className="inline-flex items-center gap-2 text-sm text-graphite-300">
              <ShieldCheck className="h-4 w-4 text-red" /> 100% money-back guarantee
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-graphite-300">
              <InfinityIcon className="h-4 w-4 text-red" /> Lifetime access on online courses
            </span>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-24 border-t border-white/10 py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Register Interest" title="Reserve Your Seat" />
            <p className="mt-6 text-graphite-300">
              Drop your details and the programme you are after. The Masterclass team will come back to you with dates, pricing and how to enrol.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <MasterclassEnquiry courses={masterclassCourses.map((c) => c.title)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
