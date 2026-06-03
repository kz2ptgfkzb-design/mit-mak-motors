'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_CURTAIN = [0.83, 0, 0.17, 1] as const;

/**
 * Ultra-premium site loader. Shows the official logo with a soft glow and a
 * smooth progress sweep, then lifts away. Plays once per session and is
 * skipped entirely under prefers-reduced-motion.
 */
export function IgnitionIntro() {
  const reduce = useReducedMotion();
  const [render, setRender] = useState(true);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('mm-loaded');
    } catch {
      /* ignore */
    }
    if (reduce || seen) {
      setPlay(false);
      setRender(false);
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const t1 = setTimeout(() => {
      setPlay(false);
      try {
        sessionStorage.setItem('mm-loaded', '1');
      } catch {
        /* ignore */
      }
    }, 2350);
    const t2 = setTimeout(() => {
      setRender(false);
      document.documentElement.style.overflow = '';
    }, 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = '';
    };
  }, [reduce]);

  if (!render) return null;

  return (
    <AnimatePresence>
      {play && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE_CURTAIN }}
        >
          {/* Ambient red glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(50% 50% at 50% 42%, rgba(225,6,0,0.16), transparent 70%)' }}
          />
          <div className="absolute inset-0 bg-grid opacity-[0.07]" />

          {/* Logo with breathing glow */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="relative"
          >
            <motion.div
              aria-hidden
              animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.95, 1.08, 0.95] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 -z-10 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(225,6,0,0.55), transparent 65%)' }}
            />
            {/* Plain img (not next/image) so the loader logo always paints instantly */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mit-mak-logo.png" alt="Mit Mak Motors" className="relative h-28 w-auto sm:h-36" />
          </motion.div>

          {/* Progress sweep */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: EASE_OUT }}
            className="mt-12 flex w-56 flex-col items-center gap-3.5"
          >
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.9, ease: [0.4, 0, 0.2, 1] }}
                className="h-full origin-left rounded-full bg-gradient-to-r from-red-700 via-red to-red-300 shadow-glow-sm"
              />
            </div>
            <span className="font-display text-[10px] uppercase tracking-[0.34em] text-graphite-500">
              Trusted. Awarded. Unmatched.
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
