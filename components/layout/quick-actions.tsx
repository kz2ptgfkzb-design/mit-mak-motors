'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { siteConfig, whatsappLink } from '@/data/site';
import { useScrolled } from '@/lib/hooks';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.05 20.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full border border-white/10 bg-ink-850/95 px-3 py-1.5 font-display text-[10px] uppercase tracking-wide text-white opacity-0 shadow-card backdrop-blur transition-all duration-200 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100">
      {children}
    </span>
  );
}

export function QuickActions() {
  const scrolled = useScrolled(500);

  return (
    <div className="fixed bottom-5 right-5 z-[85] flex flex-col items-center gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-850/80 text-graphite-300 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <Tip>Top</Tip>
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={`tel:${siteConfig.phoneHref}`}
        aria-label="Call Mit-Mak Motors"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-ink-850/80 text-white backdrop-blur transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-white/30"
      >
        <Phone className="h-[18px] w-[18px]" />
        <Tip>Call us</Tip>
      </a>

      <a
        href={whatsappLink("Hi Mit-Mak, I'm interested in a vehicle.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Mit-Mak Motors"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-glow-lg"
      >
        <WhatsAppIcon className="h-6 w-6" />
        <Tip>WhatsApp us</Tip>
      </a>
    </div>
  );
}
