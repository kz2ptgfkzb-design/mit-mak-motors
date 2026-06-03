'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { X, Phone, ArrowUpRight } from 'lucide-react';
import { megaMenu, fomoZone } from '@/data/navigation';
import { siteConfig, whatsappLink } from '@/data/site';
import { Logo } from './logo';
import { Chevron, SpeedLines } from '@/components/ui/chevron';

const featured = fomoZone[0];

export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, lenis]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-2xl" onClick={onClose} aria-hidden />
          <SpeedLines className="absolute right-0 top-0 h-full w-1/2 text-red/30" />

          <motion.nav
            data-lenis-prevent
            className="relative mx-auto flex h-full max-h-screen w-full max-w-[1400px] flex-col overflow-y-auto px-5 py-6 sm:px-8 lg:py-10"
            initial={reduce ? false : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -24, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Main menu"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={onClose}>
                <Logo />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                data-cursor="hover"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-graphite-200 transition-colors hover:border-red hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid flex-1 grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:mt-14 lg:grid-cols-12">
              <motion.div
                className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
              >
                {megaMenu.map((group) => (
                  <motion.div
                    key={group.title}
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Chevron size={9} className={group.accent ? 'text-red' : 'text-graphite-500'} />
                      <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-graphite-400">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-3.5">
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            data-cursor="hover"
                            className="group flex flex-col"
                          >
                            <span className="flex items-center gap-2 font-display text-lg uppercase tracking-tight text-white transition-colors group-hover:text-red">
                              {link.label}
                              {link.badge && (
                                <span className="rounded-full bg-red px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white">
                                  {link.badge}
                                </span>
                              )}
                              <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                            </span>
                            {link.description && (
                              <span className="text-xs text-graphite-500">{link.description}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>

              {/* Featured FOMO card */}
              <motion.div
                className="lg:col-span-4"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                <Link
                  href={featured.href}
                  onClick={onClose}
                  data-cursor="view"
                  data-cursor-text="Enter"
                  className="group relative block h-56 overflow-hidden rounded-2xl border border-white/10 lg:h-full"
                >
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className="rounded-full bg-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                      {featured.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-display text-xs uppercase tracking-[0.2em] text-red">{featured.eyebrow}</p>
                    <p className="mt-1 font-display text-2xl uppercase text-white">{featured.title}</p>
                    <p className="mt-2 text-sm text-graphite-300">{featured.blurb}</p>
                  </div>
                </Link>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <a href={`tel:${siteConfig.phoneHref}`} className="inline-flex items-center gap-2 text-sm text-white hover:text-red" data-cursor="hover">
                  <Phone className="h-4 w-4" /> {siteConfig.phoneDisplay}
                </a>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-sm text-graphite-300 hover:text-white" data-cursor="hover">
                  WhatsApp
                </a>
                <span className="text-sm text-graphite-500">Mon-Fri 8:00-17:30 · Sat 8:00-13:00</span>
              </div>
              <div className="flex items-center gap-4">
                {siteConfig.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-graphite-400 hover:text-red" data-cursor="hover">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
