import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/section-heading';
import { Reveal, RevealText } from '@/components/ui/reveal';
import { SpeedLines } from '@/components/ui/chevron';

interface CtaLink {
  label: string;
  href: string;
  /** Open in a new tab (for links to external platforms). */
  external?: boolean;
}

const ext = (link?: CtaLink) => (link?.external ? { target: '_blank', rel: 'noopener noreferrer' } : {});

export function CtaBand({
  eyebrow = 'Ready When You Are',
  title = 'Put yourself in the driver’s seat',
  description = 'Browse the showroom, get an instant cash offer, or start a finance application in under a minute. Delivered free, anywhere in South Africa.',
  image = 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1600&q=80',
  primary = { label: 'Explore the Showroom', href: '/showroom' },
  secondary,
  tertiary,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
  tertiary?: CtaLink;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>
      <SpeedLines className="absolute right-0 top-0 h-full w-1/2 text-red/30" />

      <div className="container relative z-10 py-24 lg:py-36">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-anton text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <RevealText text={title} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite-200 md:text-lg">{description}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-9 flex flex-wrap gap-4">
            <Button href={primary.href} size="lg" arrow magnetic {...ext(primary)}>
              {primary.label}
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="outline" size="lg" {...ext(secondary)}>
                {secondary.label}
              </Button>
            )}
            {tertiary && (
              <Button href={tertiary.href} variant="ghost" size="lg" {...ext(tertiary)}>
                {tertiary.label}
              </Button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
