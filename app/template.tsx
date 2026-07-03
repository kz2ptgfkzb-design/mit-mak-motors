'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Route transition. Next.js remounts templates on navigation, so this gives
 * every page a clean fade-and-rise entrance. Disabled for reduced-motion and
 * for the admin area (which has its own dashboard shell).
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  if (reduce || pathname?.startsWith('/admin')) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
