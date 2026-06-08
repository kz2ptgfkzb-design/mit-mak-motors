import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { fomoZone } from '@/data/navigation';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

export function FomoTeasers() {
  return (
    <section className="border-t border-white/10 bg-ink-950 py-24 lg:py-32" aria-label="FOMO Zone">
      <div className="container">
        <SectionHeading
          eyebrow="Don't Miss Out"
          title="The FOMO Zone"
          description="More than a dealership. Win a car, steal an auction deal, rep the merch, and learn the game."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {fomoZone.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <Link
                href={item.href}
                data-cursor="view"
                data-cursor-text="Enter"
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="(max-width:768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10 transition-opacity group-hover:from-ink-950" />
                {item.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-red px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-widest text-white">
                    {item.badge}
                  </span>
                )}
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink-900/40 text-white backdrop-blur transition-all group-hover:border-red group-hover:bg-red">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <div className="relative z-10 p-5">
                  <p className="font-display text-[11px] uppercase tracking-[0.2em] text-red">{item.eyebrow}</p>
                  <p className="mt-1 font-anton text-3xl uppercase leading-none text-white">{item.title}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-300">{item.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
