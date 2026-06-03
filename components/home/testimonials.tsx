import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/content';
import { Counter } from '@/components/ui/counter';
import { Eyebrow } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32" aria-label="Customer reviews">
      <div className="container grid gap-12 lg:grid-cols-12">
        {/* Rating block */}
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>Don&apos;t take our word</Eyebrow>
            <div className="mt-6 flex items-end gap-2">
              <span className="font-anton text-7xl leading-none text-white lg:text-8xl">
                <Counter value={9.7} decimals={1} />
              </span>
              <span className="mb-2 font-display text-2xl text-graphite-500">/ 10</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-red">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-4 max-w-xs text-base text-graphite-300">
              <span className="text-white">#1 on HelloPeter, 7 years running.</span> A service index built one
              honest deal at a time — across 4,800+ verified reviews.
            </p>
            <Button href="/about" variant="outline" className="mt-7" arrow>
              Why we&apos;re trusted
            </Button>
          </Reveal>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.07}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-850 p-6 transition-colors hover:border-white/20">
                <div className="flex items-center justify-between">
                  <Quote className="h-7 w-7 text-red/60" />
                  <span className="rounded-full border border-white/10 px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-graphite-300">
                    {t.rating}/10
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-graphite-100">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-white/5 pt-4 text-sm">
                  <span className="font-display uppercase tracking-wide text-white">{t.author}</span>
                  <span className="text-graphite-500"> · {t.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
