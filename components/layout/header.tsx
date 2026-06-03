'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrolled } from '@/lib/hooks';
import { primaryNav } from '@/data/navigation';
import { siteConfig, whatsappLink } from '@/data/site';
import { Logo } from './logo';
import { MegaMenu } from './mega-menu';
import { Button } from '@/components/ui/button';

export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(20);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90]">
        {/* Main bar */}
        <div
          className={cn(
            'border-b transition-all duration-500 ease-out-expo',
            scrolled
              ? 'border-white/10 bg-ink-950/80 py-2.5 backdrop-blur-xl'
              : 'border-transparent bg-gradient-to-b from-ink-950/70 to-transparent py-4',
          )}
        >
          <div className="container flex items-center justify-between gap-4">
            <Link href="/" aria-label="Mit-Mak Motors home" data-cursor="hover">
              <Logo />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              {primaryNav.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-cursor="hover"
                    className={cn(
                      'relative font-display text-xs uppercase tracking-[0.14em] transition-colors',
                      active ? 'text-white' : 'text-graphite-300 hover:text-white',
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-red" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${siteConfig.phoneHref}`}
                aria-label="Call us"
                data-cursor="hover"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-graphite-200 transition-colors hover:border-red hover:text-white sm:inline-flex"
              >
                <Phone className="h-4 w-4" />
              </a>
              <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="sm" className="hidden sm:inline-flex">
                WhatsApp
              </Button>

              <button
                onClick={() => setOpen(true)}
                data-cursor="hover"
                aria-label="Open menu"
                aria-expanded={open}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 py-2 pl-4 pr-2 text-white transition-colors hover:border-white/40"
              >
                <span className="hidden font-display text-xs uppercase tracking-[0.14em] sm:inline">Menu</span>
                <span className="flex h-7 w-7 flex-col items-center justify-center gap-[5px]">
                  <span className="h-px w-4 bg-white transition-all duration-300 group-hover:w-5" />
                  <span className="h-px w-5 bg-white transition-all duration-300 group-hover:w-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
