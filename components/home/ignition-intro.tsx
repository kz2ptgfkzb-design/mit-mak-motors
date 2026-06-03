'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogoMark } from '@/components/layout/logo';

const EASE = [0.83, 0, 0.17, 1] as const;

export function IgnitionIntro() {
  const reduce = useReducedMotion();
  const [render, setRender] = useState(true);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('mm-intro');
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
        sessionStorage.setItem('mm-intro', '1');
      } catch {
        /* ignore */
      }
    }, 1750);
    const t2 = setTimeout(() => {
      setRender(false);
      document.documentElement.style.overflow = '';
    }, 2450);
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
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink-950"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Streaking speed lines */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-red to-transparent"
              style={{ top: `${18 + i * 10}%` }}
              initial={{ x: '-110%', opacity: 0 }}
              animate={{ x: '110%', opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: 'easeIn' }}
            />
          ))}

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <LogoMark className="h-16 w-20" />
            </motion.div>

            <div className="mt-5 overflow-hidden">
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                className="font-anton text-4xl uppercase tracking-tight text-white sm:text-5xl"
              >
                Mit-Mak Motors
              </motion.p>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.55 }}
              className="mt-5 h-px w-48 origin-left bg-gradient-to-r from-red to-transparent"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-3 font-display text-[11px] uppercase tracking-[0.4em] text-graphite-400"
            >
              Starting the engine
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
