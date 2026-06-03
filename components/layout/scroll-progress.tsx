'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[115] h-[3px] w-full origin-left bg-red-sheen shadow-glow-sm"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
