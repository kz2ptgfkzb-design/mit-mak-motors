import type { Metadata } from 'next';
import { Phone, Clock, Mail, MapPin, Navigation } from 'lucide-react';
import { locations, flagship } from '@/data/locations';
import { siteConfig, whatsappLink } from '@/data/site';
import { getVehicle } from '@/data/vehicles';
import { PageHero } from '@/components/layout/page-hero';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Contact, 3 Locations in Pretoria',
  description:
    'Visit Mit-Mak Motors across three branches on Gerrit Maritz & Rachel de Beer Streets, Pretoria North. Call, WhatsApp or send a message, open 6 days a week.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage({ searchParams }: { searchParams: { vehicle?: string; intent?: string } }) {
  const vehicle = searchParams.vehicle ? getVehicle(searchParams.vehicle) : undefined;
  const reserving = searchParams.intent === 'reserve' && vehicle;
  const name = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}` : '';
  const prefillSubject = reserving ? `Reserve: ${name}` : '';
  const prefillMessage = reserving ? `Hi Mit-Mak, I'd like to reserve the ${name} (Stock ${vehicle?.stockNumber}). Please get in touch to take it off the market.` : '';

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Come Say Hello"
        description="Three branches across Pretoria North, open six days a week. Call, WhatsApp, or send us a message, wherever you are in South Africa, we’ll come to you."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <h2 className="font-display text-2xl uppercase tracking-tight text-white">Send us a message</h2>
              <p className="mt-1.5 text-sm text-graphite-400">We typically reply within a couple of hours during trading times.</p>
              <div className="mt-7">
                <ContactForm prefillSubject={prefillSubject} prefillMessage={prefillMessage} />
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <h3 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-white">
                <Phone className="h-4 w-4 text-red" /> Quick contact
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <a href={`tel:${siteConfig.phoneHref}`} className="flex items-center gap-3 text-graphite-200 hover:text-white">
                  <Phone className="h-4 w-4 text-graphite-500" /> {siteConfig.phoneDisplay}
                </a>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-graphite-200 hover:text-white">
                  <Navigation className="h-4 w-4 text-graphite-500" /> WhatsApp us
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-graphite-200 hover:text-white">
                  <Mail className="h-4 w-4 text-graphite-500" /> {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <h3 className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-white">
                <Clock className="h-4 w-4 text-red" /> Trading hours
              </h3>
              <ul className="mt-4 space-y-2.5">
                {siteConfig.hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-graphite-300">{h.day}</span>
                    <span className={h.time === 'Closed' ? 'text-graphite-600' : 'text-white'}>{h.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-4">
                {siteConfig.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-widest text-graphite-400 hover:text-red">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Locations + map */}
      <section className="border-t border-white/10 py-16 lg:py-24">
        <div className="container">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-red" />
            <h2 className="font-anton text-3xl uppercase tracking-tight text-white sm:text-4xl">3 Locations · Pretoria North</h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="Mit-Mak Motors locations map"
              src={`https://www.google.com/maps?q=${flagship.lat},${flagship.lng}&z=14&output=embed`}
              className="h-[420px] w-full grayscale-[0.3]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <div key={loc.id} className="flex flex-col rounded-2xl border border-white/10 bg-ink-850 p-6">
                <div className="flex items-center gap-2">
                  {loc.flagship && <span className="rounded-full bg-red px-2 py-0.5 font-display text-[9px] uppercase tracking-widest text-white">Flagship</span>}
                  <p className="font-display text-[10px] uppercase tracking-widest text-graphite-500">{loc.kind}</p>
                </div>
                <h3 className="mt-2 font-display text-lg uppercase tracking-tight text-white">{loc.name}</h3>
                <p className="mt-2 text-sm text-graphite-300">{loc.street}</p>
                <p className="text-sm text-graphite-300">{loc.suburb}, {loc.city}, {loc.postalCode}</p>
                <a href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-red">
                  <Phone className="h-3.5 w-3.5" /> {loc.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group mt-auto inline-flex items-center gap-1.5 pt-4 font-display text-xs uppercase tracking-wide text-red"
                >
                  <Navigation className="h-3.5 w-3.5" /> Get directions
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
