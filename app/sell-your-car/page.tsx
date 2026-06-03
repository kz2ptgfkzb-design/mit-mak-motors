import type { Metadata } from 'next';
import { ClipboardList, PhoneCall, ClipboardCheck, Banknote, Check } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { SellForm } from '@/components/sell/sell-form';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'Sell Your Car, Get the Best Cash Price',
  description:
    'Sell your car to Mit-Mak Motors for a fair, market-related cash price. Free valuation, instant callback, same-day payment. No admin, no hassle.',
  alternates: { canonical: '/sell-your-car' },
};

const steps = [
  { icon: ClipboardList, title: 'Tell us about your car', text: 'A few details and a couple of photos, takes two minutes.' },
  { icon: PhoneCall, title: 'Get an instant callback', text: 'Our buying team calls you back, usually within the hour, with a cash offer.' },
  { icon: ClipboardCheck, title: 'Free inspection', text: 'We verify the car at a branch or come to you. No obligation.' },
  { icon: Banknote, title: 'Same-day payment', text: 'Accept the offer and the money is in your account the same day.' },
];

const perks = ['Often beats private-sale once you factor in the hassle', 'No advertising, no strangers, no risk', 'We settle outstanding finance for you', 'Trade in and drive away in something new'];

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell or Trade"
        title="Get the Best Cash Price"
        description="Skip the strangers at your gate. Get a fair, market-related cash offer for your car, free valuation, instant callback, money the same day."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Sell Your Car', href: '/sell-your-car' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div id="offer" className="scroll-mt-28 lg:col-span-7">
            <div id="valuation" className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <SellForm />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-7">
              <h2 className="font-display text-xl uppercase tracking-tight text-white">How it works</h2>
              <ol className="mt-6 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
                      <s.icon className="h-5 w-5" />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red font-display text-[10px] text-white">
                        {i + 1}
                      </span>
                    </span>
                    <div>
                      <p className="font-display text-sm uppercase tracking-tight text-white">{s.title}</p>
                      <p className="mt-1 text-sm text-graphite-400">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-ink-850 p-7">
              <h3 className="font-display text-lg uppercase tracking-tight text-white">Why sell to Mit-Mak?</h3>
              <ul className="mt-4 space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-graphite-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2.5">
                <a href={`tel:${siteConfig.phoneHref}`} data-cursor="hover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow-sm">
                  <PhoneCall className="h-4 w-4" /> Request an instant callback
                </a>
                <a href={whatsappLink('Hi Mit-Mak, I want to sell my car and get a cash offer.')} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 font-display text-xs uppercase tracking-wide text-white transition-colors hover:border-red">
                  WhatsApp us instead
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        eyebrow="Trading up?"
        title="Sell and drive away in something new"
        description="Put your trade-in straight towards your next car from our showroom, and we’ll deliver it free, anywhere in South Africa."
        primary={{ label: 'Browse the Showroom', href: '/showroom' }}
        secondary={{ label: 'Apply for Finance', href: '/finance' }}
      />
    </>
  );
}
