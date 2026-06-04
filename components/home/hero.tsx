'use client';

import { useState, useRef, useEffect } from 'react';
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

// ── M4 Competition (S58) digital rev display ───────────────────────────────
// A curved arc rev bar with crowning shift-lights and a digital rpm readout,
// styled after the G82 cluster. Revs blip to the limiter and decay to idle.
const REV_MAX = 8000;
const REV_IDLE = 800;
const IDLE_FRAC = REV_IDLE / REV_MAX;
const SWEEP_DEG = 260;
const START_DEG = -130;
const G_CX = 40;
const G_CY = 41;
const G_R = 29;

function gaugePoint(deg: number, r = G_R): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [G_CX + r * Math.sin(rad), G_CY - r * Math.cos(rad)];
}

const [ARC_X0, ARC_Y0] = gaugePoint(START_DEG);
const [ARC_X1, ARC_Y1] = gaugePoint(START_DEG + SWEEP_DEG);
const REV_ARC = `M ${ARC_X0.toFixed(2)} ${ARC_Y0.toFixed(2)} A ${G_R} ${G_R} 0 1 1 ${ARC_X1.toFixed(2)} ${ARC_Y1.toFixed(2)}`;

// BMW M tricolour cascade: blue -> violet -> red.
const SHIFT_PIPS = Array.from({ length: 7 }, (_, i) => {
  const [x, y] = gaugePoint(-48 + i * 16, G_R + 5);
  const color = i < 3 ? '#1CA7E8' : i < 5 ? '#8A4FD6' : '#FF2A1B';
  return { x, y, color, threshold: 0.5 + i * 0.072, isFlash: i >= 5 };
});

// rpm scale ticks; the top of the scale (redline) reads in M red.
const RPM_TICKS = Array.from({ length: 9 }, (_, k) => {
  const a = START_DEG + (k / 8) * SWEEP_DEG;
  const [x1, y1] = gaugePoint(a, G_R - 5.5);
  const [x2, y2] = gaugePoint(a, G_R - 2.5);
  return { x1, y1, x2, y2, red: k >= 7 };
});

const easeOutCirc = (k: number) => Math.sqrt(1 - (k - 1) * (k - 1));
const easeInOutSine = (k: number) => 0.5 - 0.5 * Math.cos(Math.PI * k);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

// The throttle blip: snap to the limiter, bounce off, then decay to idle.
function blipFrac(p: number): number {
  if (p <= 0.15) return mix(IDLE_FRAC, 1, easeOutCirc(p / 0.15));
  if (p <= 0.3) return mix(1, 0.84, (p - 0.15) / 0.15);
  return mix(0.84, IDLE_FRAC, easeInOutSine((p - 0.3) / 0.7));
}

function HeroRev() {
  const reduce = useReducedMotion();
  const [frac, setFrac] = useState(IDLE_FRAC);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function blip() {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const DUR = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      const p = Math.min(t / DUR, 1);
      setFrac(blipFrac(p));
      setElapsed(t);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setFrac(IDLE_FRAC);
    };
    raf.current = requestAnimationFrame(tick);
  }

  const clamped = Math.min(Math.max(frac, 0), 1);
  const angle = START_DEG + clamped * SWEEP_DEG;
  const rpm = Math.round((clamped * REV_MAX) / 100) * 100;
  const redline = clamped >= 0.9;
  const flashOn = redline && Math.floor(elapsed / 70) % 2 === 0;

  return (
    <button
      onMouseEnter={blip}
      onClick={blip}
      aria-label="Rev the engine"
      className="group relative hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-ink-900/50 backdrop-blur transition-shadow hover:shadow-glow lg:inline-flex"
    >
      <svg viewBox="0 0 80 80" className="h-[68px] w-[68px]">
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#16A5E6" />
            <stop offset="44%" stopColor="#7A3FB8" />
            <stop offset="80%" stopColor="#E2001A" />
            <stop offset="100%" stopColor="#FF2A1B" />
          </linearGradient>
          <filter id="pipBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <path d={REV_ARC} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3.4} strokeLinecap="round" />
        {RPM_TICKS.map((t, i) => (
          <line
            key={`tick-${i}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.red ? '#E2001A' : '#FFFFFF'}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={t.red ? 0.5 : 0.22}
          />
        ))}
        <path
          d={REV_ARC}
          fill="none"
          stroke="url(#revFill)"
          strokeWidth={3.4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - clamped}
        />

        {SHIFT_PIPS.map((p, i) => {
          const on = clamped >= p.threshold || (p.isFlash && flashOn);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={3.6} fill={p.color} filter="url(#pipBlur)" opacity={on ? 0.85 : 0} />
              <circle cx={p.x} cy={p.y} r={2} fill={p.color} opacity={on ? 1 : 0.14} />
            </g>
          );
        })}

        <line
          x1={G_CX}
          y1={G_CY - (G_R - 4)}
          x2={G_CX}
          y2={G_CY - (G_R + 2.5)}
          stroke={redline ? '#FF2A1B' : '#FFFFFF'}
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${angle.toFixed(2)} ${G_CX} ${G_CY})`}
        />

        <text
          x={G_CX}
          y={G_CY + 2}
          textAnchor="middle"
          fill="#FFFFFF"
          style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '15px', fontWeight: 700 }}
        >
          {(rpm / 1000).toFixed(1)}
        </text>
        <text
          x={G_CX}
          y={G_CY + 11}
          textAnchor="middle"
          fill="#7C8088"
          style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '5px', letterSpacing: '0.18em' }}
        >
          X1000
        </text>

        {/* BMW M tricolour stripe */}
        <g transform="translate(35.5 62.5) skewX(-15)">
          <rect x={0} y={0} width={3} height={9} rx={0.6} fill="#16A5E6" />
          <rect x={4} y={0} width={3} height={9} rx={0.6} fill="#6E3A9E" />
          <rect x={8} y={0} width={3} height={9} rx={0.6} fill="#E2001A" />
        </g>
      </svg>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-display text-[9px] uppercase tracking-[0.2em] text-graphite-400">
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/45" />
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
