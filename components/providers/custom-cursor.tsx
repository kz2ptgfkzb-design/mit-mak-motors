'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useIsDesktop, useMounted } from '@/lib/hooks';

type Variant = 'default' | 'hover' | 'text' | 'drag';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-cursor]';

export function CustomCursor() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const active = mounted && isDesktop && !reduce;

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 380, damping: 36, mass: 0.6 });
  const ringY = useSpring(cursorY, { stiffness: 380, damping: 36, mass: 0.6 });
  const dotX = useSpring(cursorX, { stiffness: 1100, damping: 60 });
  const dotY = useSpring(cursorY, { stiffness: 1100, damping: 60 });

  const [variant, setVariant] = useState<Variant>('default');
  const [label, setLabel] = useState('');
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add('has-cursor');

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (el) {
        const v = (el.getAttribute('data-cursor') as Variant) || 'hover';
        setVariant(v);
        setLabel(el.getAttribute('data-cursor-text') || '');
      } else {
        setVariant('default');
        setLabel('');
      }
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mousedown', downFn);
    window.addEventListener('mouseup', upFn);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', downFn);
      window.removeEventListener('mouseup', upFn);
    };
  }, [active, cursorX, cursorY]);

  if (!active) return null;

  const big = variant === 'hover' || variant === 'text' || variant === 'drag';
  const ringSize = big ? 64 : 30;

  return (
    <>
      <motion.div style={{ x: ringX, y: ringY }} className="pointer-events-none fixed left-0 top-0 z-[120]">
        <motion.div
          className="flex items-center justify-center rounded-full border border-white/80 mix-blend-difference"
          animate={{
            width: ringSize,
            height: ringSize,
            marginLeft: -ringSize / 2,
            marginTop: -ringSize / 2,
            backgroundColor: big ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0)',
            scale: down ? 0.85 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          {label && (
            <span className="font-display text-[9px] uppercase tracking-widest text-white">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
      <motion.div style={{ x: dotX, y: dotY }} className="pointer-events-none fixed left-0 top-0 z-[120]">
        <motion.div
          className="rounded-full bg-red"
          animate={{
            width: big ? 0 : 6,
            height: big ? 0 : 6,
            marginLeft: big ? 0 : -3,
            marginTop: big ? 0 : -3,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </>
  );
}
