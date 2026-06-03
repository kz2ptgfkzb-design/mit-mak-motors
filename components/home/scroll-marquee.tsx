'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLenis } from 'lenis/react';

/**
 * Giant outline headline that scrubs horizontally as the page scrolls.
 * Powered by GSAP ScrollTrigger, synced to Lenis smooth scroll.
 */
export function ScrollMarquee({ text = 'Trusted · Awarded · Unmatched' }: { text?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // Keep ScrollTrigger in step with Lenis.
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { xPercent: 8 },
        {
          xPercent: -42,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden border-y border-white/[0.06] bg-ink-950 py-10 lg:py-16" aria-hidden>
      <div ref={inner} className="flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <span
            key={k}
            className="text-stroke px-6 font-anton text-[13vw] uppercase leading-none tracking-tight"
          >
            {text} ·{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
