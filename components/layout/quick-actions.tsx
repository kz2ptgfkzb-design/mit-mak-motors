'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUp } from 'lucide-react';
import { useScrolled } from '@/lib/hooks';

// Call + WhatsApp live in the header, so the only floating action is back-to-top.
export function QuickActions() {
  const scrolled = useScrolled(500);
  const lenis = useLenis();

  return (
    <div className="fixed bottom-5 right-5 z-[85] flex flex-col items-center gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
            aria-label="Back to top"
            data-cursor="hover"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ink-850/80 text-graphite-300 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
