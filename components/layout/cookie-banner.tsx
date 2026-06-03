'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

const KEY = 'mm-cookie-consent';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 1400);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function choose(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[95] mx-auto max-w-md rounded-2xl border border-white/10 bg-ink-850/90 p-5 shadow-card backdrop-blur-xl md:left-6 md:right-auto"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
              <Cookie className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-white">We value your privacy</p>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite-300">
                We use essential cookies to run the site and optional ones to improve it. You can decline the
                optional ones — your choice.{' '}
                <Link href="/privacy" className="text-red underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  onClick={() => choose('accepted')}
                  data-cursor="hover"
                  className="rounded-full bg-red px-5 py-2 font-display text-[11px] uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow-sm"
                >
                  Accept all
                </button>
                <button
                  onClick={() => choose('declined')}
                  data-cursor="hover"
                  className="rounded-full border border-white/15 px-5 py-2 font-display text-[11px] uppercase tracking-wide text-graphite-200 transition-colors hover:border-white/40 hover:text-white"
                >
                  Decline optional
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
