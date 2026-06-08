'use client';

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reveal-on-scroll that NEVER leaves content stuck invisible. Framer's
 * `whileInView` can miss elements under smooth-scroll (Lenis) or fast /
 * programmatic scrolling, leaving them at opacity 0 (the "black space" gaps).
 * This drives the reveal off a direct IntersectionObserver PLUS a
 * scroll-position failsafe: if the element is ever actually inside the
 * viewport, it reveals - no matter how it got there.
 */
function useInViewport<T extends HTMLElement>(enabled: boolean, amount = 0.01) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let settled = false;
    let raf = 0;

    function finish() {
      if (settled) return;
      settled = true;
      setShown(true);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    }
    function onScroll() {
      if (settled || !el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) finish();
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) finish();
      },
      { rootMargin: '0px 0px 12% 0px', threshold: amount },
    );
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Catch content already on-screen (above the fold, or scrolled-to before hydration).
    raf = requestAnimationFrame(onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled, amount]);

  return { ref, shown };
}

/** Fade-and-rise a block of content the first time it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.01,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** kept for API compatibility; reveal is always one-shot */
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useInViewport<HTMLDivElement>(!reduce, amount);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
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
  inView = true,
}: {
  text: string;
  className?: string;
  splitBy?: 'word' | 'char';
  stagger?: number;
  delay?: number;
  once?: boolean;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  // Gate on the viewport only when inView is requested; otherwise animate on mount.
  const { ref, shown } = useInViewport<HTMLSpanElement>(!reduce && inView, 0.2);

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

  const animateState = inView ? (shown ? 'show' : 'hidden') : 'show';

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      variants={container}
      initial="hidden"
      animate={animateState}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <Fragment key={i}>
          <span className="inline-flex overflow-hidden pb-[0.06em] align-bottom" aria-hidden>
            <motion.span className="inline-block" variants={child}>
              {token === ' ' ? ' ' : token}
            </motion.span>
          </span>
          {/* Render the inter-word space as a sibling text node so it is not
              trimmed inside the clip span (the cause of run-together headings),
              while still allowing the title to wrap. */}
          {splitBy === 'word' && i < tokens.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
