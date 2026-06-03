import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { footerGroups, legalNav } from '@/data/navigation';
import { locations } from '@/data/locations';
import { siteConfig } from '@/data/site';
import { Logo } from './logo';
import { NewsletterForm } from './newsletter-form';
import { ChevronDivider } from '@/components/ui/chevron';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <ChevronDivider className="py-6 opacity-60" />

      <div className="container pb-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite-300">
              {siteConfig.description}
            </p>
            <div className="mt-7 max-w-sm">
              <p className="mb-3 font-display text-[11px] uppercase tracking-[0.24em] text-graphite-400">
                Get fresh stock in your inbox
              </p>
              <NewsletterForm />
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-widest text-graphite-400 transition-colors hover:text-red"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-display text-[11px] uppercase tracking-[0.22em] text-graphite-400">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-graphite-200 transition-colors hover:text-red"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Locations + hours */}
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="mb-5 flex items-center gap-2 font-display text-sm uppercase tracking-wide text-white">
              <MapPin className="h-4 w-4 text-red" /> 6 Locations · Pretoria North
            </h3>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc) => (
                <div key={loc.id}>
                  <p className="font-display text-sm uppercase tracking-tight text-white">{loc.name}</p>
                  <p className="text-xs text-graphite-500">{loc.kind}</p>
                  <p className="mt-1.5 text-sm text-graphite-300">{loc.street}</p>
                  <p className="text-sm text-graphite-300">
                    {loc.suburb}, {loc.postalCode}
                  </p>
                  <a
                    href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs text-graphite-400 hover:text-red"
                  >
                    <Phone className="h-3 w-3" /> {loc.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-5 flex items-center gap-2 font-display text-sm uppercase tracking-wide text-white">
              <Clock className="h-4 w-4 text-red" /> Trading Hours
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-graphite-300">{h.day}</span>
                  <span className={h.time === 'Closed' ? 'text-graphite-600' : 'text-white'}>{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link href="/finance" className="group inline-flex items-center gap-1.5 text-sm text-graphite-200 hover:text-red">
                Apply for Finance <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/finance#insurance" className="group inline-flex items-center gap-1.5 text-sm text-graphite-200 hover:text-red">
                King Price Insurance <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-xs text-graphite-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved. ·{' '}
            <span className="font-display uppercase tracking-widest text-graphite-400">{siteConfig.tagline}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-graphite-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
