import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fomoSlugs, getFomoDetail } from '@/data/fomo';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { CtaBand } from '@/components/layout/cta-band';

export function generateStaticParams() {
  return fomoSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = getFomoDetail(params.slug);
  if (!d) return {};
  return {
    title: `${d.title}, ${d.eyebrow}`,
    description: d.tagline,
    alternates: { canonical: `/fomo-zone/${d.slug}` },
  };
}

export default function FomoDetailPage({ params }: { params: { slug: string } }) {
  const d = getFomoDetail(params.slug);
  if (!d) notFound();

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        description={d.tagline}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'FOMO Zone', href: '/fomo-zone' },
          { label: d.title, href: `/fomo-zone/${d.slug}` },
        ]}
        image="https://img.autotrader.co.za/47470885/Crop1024x576.jpg"
      />

      <section className="py-16 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={d.image} alt={d.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
              {d.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-widest text-white">
                  {d.badge}
                </span>
              )}
            </div>
          </Reveal>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.24em] text-red">{d.eyebrow}</p>
            <h2 className="mt-3 font-anton text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">{d.title}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-graphite-300">{d.lead}</p>
            <div className="mt-8">
              <Button href={d.external.url} target="_blank" rel="noopener noreferrer" size="lg" arrow magnetic>
                {d.external.label}
              </Button>
            </div>
            {d.note && <p className="mt-4 text-xs text-graphite-500">{d.note}</p>}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-950 py-16 lg:py-24">
        <div className="container">
          <SectionHeading eyebrow={d.eyebrow} title={d.blocksLabel} />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-900/50 p-6 transition-colors hover:border-red/40">
                  {b.meta && <p className="font-anton text-2xl uppercase leading-none text-red">{b.meta}</p>}
                  <h3 className="mt-2 font-display text-lg uppercase tracking-wide text-white">{b.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-300">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Don't Miss Out"
        title={d.external.label}
        description="Tap through to the live page to take part. New drops and lots land often, so get in early."
        primary={{ label: d.external.label, href: d.external.url, external: true }}
        secondary={{ label: 'Back to FOMO Zone', href: '/fomo-zone' }}
      />
    </>
  );
}
