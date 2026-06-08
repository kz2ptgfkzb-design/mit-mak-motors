'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { X, Phone, ArrowUpRight, MessageSquare } from 'lucide-react';
import { megaMenu, fomoZone, type FomoItem } from '@/data/navigation';
import { siteConfig, whatsappLink } from '@/data/site';
import { BLUR } from '@/lib/blur';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { Chevron, SpeedLines } from '@/components/ui/chevron';

const featured = fomoZone[0];

// Hovering / focusing a menu group lights up a contextual promo in the right
// rail, like aisles in a showroom. Every target is a real FOMO item, so the
// default state and first paint stay identical to the static raffle card.
const PREVIEW: Record<string, FomoItem> = {
  'Buy a Car': fomoZone[0],
  'Finance & Insure': fomoZone[3],
  'Sell or Trade': fomoZone[1],
  'FOMO Zone': fomoZone[1],
  Company: fomoZone[2],
};

export function MegaMenu({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement>;
}) {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<FomoItem | null>(null);

  const active = preview ?? featured;

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    setPreview(null);

    // Move focus into the dialog as soon as it opens. The close button is
    // already mounted when this effect runs, so no timeout is needed (a delay
    // would leave a brief window where Tab could escape the trap).
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !navRef.current) return;
      const focusables = navRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      // If focus has escaped the dialog, pull it straight back in.
      if (!navRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
      // Return focus to the button that opened the menu.
      triggerRef?.current?.focus();
    };
  }, [open, onClose, lenis, triggerRef]);

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
            ref={navRef}
            data-lenis-prevent
            id="main-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="relative mx-auto flex h-full max-h-screen w-full max-w-[1400px] flex-col overflow-y-auto px-5 py-6 sm:px-8 lg:py-10"
            initial={reduce ? false : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -24, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={onClose}>
                <Logo />
              </Link>
              <button
                ref={closeRef}
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
                className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:col-span-2 lg:col-span-8 lg:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
              >
                {megaMenu.map((group) => (
                  <motion.div
                    key={group.title}
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.5, ease }}
                    onMouseEnter={() => setPreview(PREVIEW[group.title] ?? null)}
                    onMouseLeave={() => setPreview(null)}
                    onFocus={() => setPreview(PREVIEW[group.title] ?? null)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setPreview(null);
                    }}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Chevron size={9} className={group.accent ? 'text-red' : 'text-graphite-500'} />
                      <h3 className="font-display text-[11px] uppercase tracking-[0.24em] text-graphite-400">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-3.5">
                      {group.links.map((link) => {
                        const current = pathname === link.href;
                        return (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              data-cursor="hover"
                              aria-current={current ? 'page' : undefined}
                              className="group flex flex-col"
                            >
                              <span className="flex items-center gap-2 font-display text-lg uppercase tracking-tight text-white transition-all group-hover:translate-x-1 group-hover:text-red">
                                {current && <Chevron size={8} className="text-red" />}
                                {link.label}
                                {link.badge && (
                                  <span className="rounded-full bg-red px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white">
                                    {link.badge}
                                  </span>
                                )}
                                <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                              </span>
                              {link.description && (
                                <span className="text-xs text-graphite-400">{link.description}</span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right rail: featured / preview showcase + customer care */}
              <motion.div
                className="flex flex-col gap-4 md:col-span-2 lg:col-span-4"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                <Link
                  href={active.href}
                  onClick={onClose}
                  data-cursor="view"
                  data-cursor-text="Enter"
                  className="group relative block h-56 overflow-hidden rounded-2xl border border-white/10 lg:h-auto lg:min-h-[14rem] lg:flex-1"
                >
                  {reduce ? (
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR}
                      className="object-cover"
                    />
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          sizes="(max-width:1024px) 100vw, 33vw"
                          placeholder="blur"
                          blurDataURL={BLUR}
                          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  {active.badge && (
                    <div className="absolute left-5 top-5">
                      <span className="rounded-full bg-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                        {active.badge}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-display text-xs uppercase tracking-[0.2em] text-red">{active.eyebrow}</p>
                    <p className="mt-1 font-display text-2xl uppercase text-white">{active.title}</p>
                    <p className="mt-2 text-sm text-graphite-300">{active.blurb}</p>
                  </div>
                </Link>

                {/* Customer Care: the in-menu home for Compliment / Complaint */}
                <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
                  <p className="font-display text-[11px] uppercase tracking-[0.24em] text-graphite-400">
                    Customer Care
                  </p>
                  <Link
                    href="/feedback"
                    onClick={onClose}
                    data-cursor="hover"
                    className="group mt-3 flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3 transition-colors hover:border-red"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-display text-sm uppercase tracking-tight text-white">
                        Compliment / Complaint
                      </span>
                      <span className="text-xs text-graphite-400">Tell us how we did</span>
                    </span>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-graphite-500 transition-all group-hover:translate-x-0.5 group-hover:text-red" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href={`tel:${siteConfig.phoneHref}`} className="inline-flex items-center gap-2 text-sm text-white hover:text-red" data-cursor="hover">
                  <Phone className="h-4 w-4" /> {siteConfig.phoneDisplay}
                </a>
                <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">
                  WhatsApp
                </Button>
                <span className="text-sm text-graphite-400">Mon-Fri 8:00-17:30 · Sat 8:00-13:00</span>
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
