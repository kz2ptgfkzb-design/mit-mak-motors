'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RevealText, Reveal } from '@/components/ui/reveal';
import { SpeedLines, Chevron } from '@/components/ui/chevron';

// High-quality hero shot of a BMW M4 — a model they actually stock & sell.
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2000&h=1100&q=85';

function HeroRev() {
  const [rev, setRev] = useState(false);
  const reduce = useReducedMotion();
  return (
    <button
      onMouseEnter={() => setRev(true)}
      onMouseLeave={() => setRev(false)}
      onClick={() => {
        setRev(true);
        setTimeout(() => setRev(false), 720);
      }}
      aria-label="Rev the engine"
      className="group relative hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-900/40 backdrop-blur transition-shadow hover:shadow-glow lg:inline-flex"
    >
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <path d="M32 32 L32 12" stroke="#E10600" strokeWidth="1.5" opacity="0.3" />
        {[...Array(9)].map((_, i) => {
          const a = (-120 + i * 30) * (Math.PI / 180);
          return (
            <line
              key={i}
              x1={32 + Math.sin(a) * 22}
              y1={32 - Math.cos(a) * 22}
              x2={32 + Math.sin(a) * 26}
              y2={32 - Math.cos(a) * 26}
              stroke={i > 6 ? '#E10600' : 'rgba(255,255,255,0.4)'}
              strokeWidth="1.5"
            />
          );
        })}
        <motion.line
          x1="32"
          y1="32"
          x2="32"
          y2="14"
          stroke="#E10600"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ originX: '32px', originY: '32px' }}
          animate={{ rotate: reduce ? -110 : rev ? [-110, 70, 28, 96, -100] : -110 }}
          transition={{ duration: 0.72, ease: 'easeOut' }}
        />
        <circle cx="32" cy="32" r="3" fill="#E10600" />
      </svg>
      <span className="absolute -bottom-5 font-display text-[9px] uppercase tracking-[0.2em] text-graphite-400">
        Rev
      </span>
    </button>
  );
}

export function Hero({ vehicle }: { vehicle: Vehicle }) {
  const reduce = useReducedMotion();
  const r = reduce ? 0 : 1;

  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const linesX = useTransform(sx, [-0.5, 0.5], [50 * r, -50 * r]);

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative flex h-[100svh] min-h-[660px] w-full items-center overflow-hidden bg-ink-950"
      aria-label="Mit-Mak Motors hero"
    >
      {/* Hero car */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="BMW M4 performance coupe at Mit-Mak Motors"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Cinematic gradients — keep the car visible; the headline uses a text-shadow for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/35 to-transparent" />

      {/* Speed lines */}
      <motion.div style={{ x: linesX }} className="absolute right-[-5%] top-0 z-[1] h-full w-2/3 text-red">
        <SpeedLines className="h-full w-full" />
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 pt-20">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-ink-900/40 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="font-display text-[11px] uppercase tracking-[0.22em] text-graphite-200">
              The Driver&apos;s Seat · Pretoria
            </span>
          </div>
        </Reveal>

        <h1 className="font-anton text-[clamp(3.4rem,12vw,11rem)] uppercase leading-[0.82] tracking-tight text-white [text-shadow:0_2px_30px_rgba(5,5,5,0.85)]">
          <span className="block overflow-hidden">
            <RevealText text="Trusted." splitBy="char" stagger={0.035} delay={0.1} inView={false} />
          </span>
          <span className="block overflow-hidden text-stroke">
            <RevealText text="Awarded." splitBy="char" stagger={0.035} delay={0.25} inView={false} />
          </span>
          <span className="block overflow-hidden text-red red-glow-text">
            <RevealText text="Unmatched." splitBy="char" stagger={0.035} delay={0.4} inView={false} />
          </span>
        </h1>

        <Reveal delay={0.6} className="mt-7 max-w-xl">
          <p className="text-base leading-relaxed text-graphite-200 md:text-lg">
            Pretoria&apos;s premium pre-owned dealership. Every car inspected &amp; reconditioned,
            delivered <span className="text-white">FREE</span> anywhere in South Africa.
          </p>
        </Reveal>

        <Reveal delay={0.7} className="mt-9 flex flex-wrap items-center gap-4">
          <Button href="/showroom" size="lg" arrow magnetic>
            Explore the Showroom
          </Button>
          <Button href="/sell-your-car" variant="outline" size="lg">
            Get a Cash Offer
          </Button>
          <HeroRev />
        </Reveal>
      </div>

      {/* Featured vehicle tag */}
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="group absolute bottom-10 right-6 z-10 hidden items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/60 p-2.5 pr-4 backdrop-blur-xl transition-colors hover:border-red/50 lg:flex"
      >
        <div className="relative h-16 w-24 overflow-hidden rounded-xl">
          <Image src={vehicle.images[1] ?? vehicle.images[0]} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-red">Now in the showroom</p>
          <p className="font-display text-sm uppercase tracking-tight text-white">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="text-xs text-graphite-300">{formatPrice(vehicle.price)}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-graphite-400 transition-all group-hover:-translate-y-0.5 group-hover:text-red" />
      </Link>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-graphite-400">Scroll</span>
        <motion.div
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-red"
        >
          <Chevron size={11} className="rotate-90" />
        </motion.div>
      </div>
    </section>
  );
}
