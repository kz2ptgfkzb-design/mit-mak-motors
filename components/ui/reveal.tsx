'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade-and-rise a block of content the first time it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered word/char reveal, used for assembling headlines. */
export function RevealText({
  text,
  className,
  splitBy = 'word',
  stagger = 0.05,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  splitBy?: 'word' | 'char';
  stagger?: number;
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const tokens = splitBy === 'char' ? Array.from(text) : text.split(' ');

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: '115%' },
    show: { y: 0, transition: { duration: 0.85, ease: EASE } },
  };

  return (
    <motion.span
      className={cn('inline-block', className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.5 }}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-[0.06em] align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={child}>
            {token === ' ' ? ' ' : token}
            {splitBy === 'word' && i < tokens.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
