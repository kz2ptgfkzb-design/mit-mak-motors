import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { carImage } from '@/lib/img';
import { Eyebrow } from '@/components/ui/section-heading';
import { Reveal, RevealText } from '@/components/ui/reveal';
import { SpeedLines } from '@/components/ui/chevron';

export function PageHero({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
  crumbs,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
  crumbs?: { label: string; href: string }[];
  /** Optional darkened backdrop photo behind the hero. */
  image?: string;
}) {
  const center = align === 'center';
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink-fade pb-12 pt-32 lg:pb-16 lg:pt-40">
      {image && (
        <>
          <Image
            src={carImage(image, 1600)}
            unoptimized={image.includes('autotrader.co.za')}
            alt=""
            fill
            aria-hidden
            priority
            sizes="100vw"
            className="pointer-events-none select-none object-cover object-center opacity-40"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/35" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
        </>
      )}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <SpeedLines className="absolute right-0 top-0 h-full w-1/3 text-red/20" />
      <div className={cn('container relative', center && 'text-center')}>
        {crumbs && (
          <nav aria-label="Breadcrumb" className={cn('mb-5 flex items-center gap-2 text-xs text-graphite-500', center && 'justify-center')}>
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-graphite-700">/</span>}
                <Link href={c.href} className="transition-colors hover:text-red">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <Reveal className={cn('mb-5', center && 'flex justify-center')}>
            <Eyebrow center={center}>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <h1 className="font-anton text-5xl uppercase leading-[0.88] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <RevealText text={title} splitBy="word" stagger={0.05} inView={false} />
        </h1>
        {description && (
          <Reveal delay={0.12}>
            <p className={cn('mt-6 max-w-2xl text-base leading-relaxed text-graphite-300 md:text-lg', center && 'mx-auto')}>
              {description}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
