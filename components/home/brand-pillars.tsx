'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { Counter } from '@/components/ui/counter';
import { Chevron } from '@/components/ui/chevron';

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const PILLARS = [
  {
    n: '01',
    title: ['Delivered FREE', 'anywhere in SA'],
    body: 'From Musina to Cape Agulhas, your car arrives at your door, fully prepped, free of charge. We handle transport, paperwork and handover.',
    image: img('1502161254066-6c74afbf07aa'),
    metric: { value: 9, suffix: '/9', decimals: 0, label: 'Provinces · door-to-door · free' },
  },
  {
    n: '02',
    title: ['Inspected &', 'Reconditioned'],
    body: 'Every vehicle passes a 212-point mechanical, electrical and cosmetic inspection. Nothing reaches the floor until it meets standard.',
    image: img('1493134799591-2c9eed26201a'),
    metric: { value: 212, suffix: '-pt', decimals: 0, label: 'Inspection on every single car' },
  },
  {
    n: '03',
    title: ['Dealer of', 'the Year'],
    body: 'AutoTrader Dealer of the Year, 2024 and 2025, recognised for the cars, the service and the experience, twice over.',
    image: img('1583121274602-3e2820c69888'),
    metric: { value: 2, suffix: '×', decimals: 0, label: 'AutoTrader DOTY · 2024 & 2025' },
  },
  {
    n: '04',
    title: ['#1 on', 'HelloPeter'],
    body: 'Seven years running at the top of HelloPeter. A 9.7 / 10 service index built one honest deal at a time.',
    image: img('1605559424843-9e4c228bf1c2'),
    metric: { value: 9.7, suffix: '/10', decimals: 1, label: '7 years #1 · verified rating' },
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function BrandPillars() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const fillClip = useTransform(scrollYProgress, [0, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(PILLARS.length - 1, Math.max(0, Math.floor(v * PILLARS.length)));
    setActive(idx);
  });

  const pillar = PILLARS[active];

  return (
    <section ref={ref} className="relative" style={{ height: `${PILLARS.length * 100}vh` }} aria-label="Why Mit-Mak">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Crossfading backgrounds */}
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.n}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.08 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ willChange: 'opacity, transform' }}
          >
            <Image src={p.image} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-transparent" />

        <div className="container relative z-10 grid w-full items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <Chevron size={11} className="text-red" />
              <span className="font-display text-[11px] uppercase tracking-[0.3em] text-graphite-300">
                Why Mit-Mak
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <span className="font-anton text-[18vw] leading-none text-white/[0.06] lg:text-[10rem]">
                  {pillar.n}
                </span>
                <h2 className="-mt-[8vw] font-anton text-5xl uppercase leading-[0.85] tracking-tight text-white sm:text-6xl lg:-mt-28 lg:text-8xl">
                  {pillar.title.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-graphite-200 md:text-lg">{pillar.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Metric + progress list */}
          <div className="lg:col-span-5 lg:pl-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`m-${active}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-10 rounded-2xl border border-white/10 bg-ink-900/50 p-7 backdrop-blur-xl"
              >
                <div className="font-anton text-6xl leading-none text-red lg:text-7xl">
                  <Counter value={pillar.metric.value} decimals={pillar.metric.decimals} suffix={pillar.metric.suffix} />
                </div>
                <p className="mt-3 text-sm text-graphite-300">{pillar.metric.label}</p>
              </motion.div>
            </AnimatePresence>

            <ul className="space-y-3">
              {PILLARS.map((p, i) => (
                <li
                  key={p.n}
                  className={cn(
                    'flex items-center gap-3 border-l-2 pl-4 transition-all duration-300',
                    active === i ? 'border-red' : 'border-white/10',
                  )}
                >
                  <span className={cn('font-display text-xs', active === i ? 'text-red' : 'text-graphite-500')}>{p.n}</span>
                  <span
                    className={cn(
                      'font-display text-sm uppercase tracking-wide transition-colors',
                      active === i ? 'text-white' : 'text-graphite-500',
                    )}
                  >
                    {p.title.join(' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chevron scroll-progress fill */}
        <div className="absolute inset-x-0 bottom-7 z-10">
          <div className="container flex items-center gap-4">
            <span className="font-display text-xs text-graphite-400">
              0{active + 1} <span className="text-graphite-600">/ 0{PILLARS.length}</span>
            </span>
            <div className="relative h-4 flex-1">
              <div className="absolute inset-0 flex items-center justify-between text-white/15">
                {Array.from({ length: 26 }).map((_, i) => (
                  <Chevron key={i} size={8} className="shrink-0" />
                ))}
              </div>
              <motion.div
                className="absolute inset-0 flex items-center justify-between text-red"
                style={{ clipPath: fillClip }}
              >
                {Array.from({ length: 26 }).map((_, i) => (
                  <Chevron key={i} size={8} className="shrink-0" />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
