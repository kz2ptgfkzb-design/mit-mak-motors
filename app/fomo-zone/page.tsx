import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fomoZone } from '@/data/navigation';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'FOMO Zone, Raffle, Auction, Merch & Masterclass',
  description:
    'The Mit-Mak FOMO Zone: win a car in the raffle, steal a deal at the BobElz auction, rep the UB Drip merch, and learn the game at our masterclass.',
  alternates: { canonical: '/fomo-zone' },
};

const detail: Record<string, string> = {
  raffle:
    'Every ticket is a shot at driving away in a fully-loaded hero car, reconditioned, licensed and delivered free to your door. Draws are streamed live, winners announced on the spot. Limited tickets, big odds, bigger energy.',
  auction:
    'No reserve. No games. Hand-picked stock goes under the hammer live, and the highest bid wins, often well below retail. Register, get verified, and bid from anywhere in South Africa.',
  merch:
    'Limited-run apparel built for the culture, tees, caps and outerwear that rep the brand on every street. Drops are small and sell fast. Cop it before it’s gone.',
  masterclass:
    'Everything we’ve learned about buying smart, selling high and financing right, taught straight, no gatekeeping. Live sessions and online modules for first-timers and seasoned petrolheads alike.',
};

export default function FomoZonePage() {
  return (
    <>
      <PageHero
        eyebrow="Don't Miss Out"
        title="The FOMO Zone"
        description="More than a dealership. Win a car, steal an auction deal, rep the merch and learn the game, this is where the Mit-Mak community lives."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FOMO Zone', href: '/fomo-zone' }]}
        image="https://img.autotrader.co.za/47129441/Crop1024x576.jpg"
      />

      <div className="py-16 lg:py-24">
        {fomoZone.map((item, i) => (
          <section key={item.id} id={item.id} className="scroll-mt-28 py-10">
            <div className="container">
              <div className={cn('grid items-center gap-10 lg:grid-cols-2', i % 2 === 1 && 'lg:[&>*:first-child]:order-2')}>
                <Reveal>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                    {item.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-widest text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Reveal>
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.24em] text-red">{item.eyebrow}</p>
                  <h2 className="mt-2 font-anton text-4xl uppercase leading-none tracking-tight text-white sm:text-5xl">{item.title}</h2>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-graphite-300">{detail[item.id] ?? item.blurb}</p>
                  <div className="mt-7">
                    <Button href={item.href} arrow>
                      {item.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CtaBand
        eyebrow="Be First"
        title="Get first access to every drop"
        description="Raffles, auctions, merch and masterclasses sell out fast. Join the newsletter and never miss the moment."
        primary={{ label: 'Join the Newsletter', href: '/newsletter' }}
        secondary={{ label: 'Browse the Showroom', href: '/showroom' }}
      />
    </>
  );
}
