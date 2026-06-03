import type { Metadata } from 'next';
import { Check, Mail } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { NewsletterForm } from '@/components/layout/newsletter-form';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Join the Mit-Mak Motors newsletter for fresh stock, finance offers, and first access to raffles, auctions and merch drops.',
  alternates: { canonical: '/newsletter' },
};

const benefits = [
  'New arrivals before they hit the showroom',
  'First access to raffles, auctions & merch drops',
  'Finance deals and limited-time offers',
  'Buying & selling guides, straight to your inbox',
];

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        eyebrow="Stay in the Loop"
        title="Join the Newsletter"
        description="Fresh stock, real offers and first dibs on everything in the FOMO Zone. No spam, unsubscribe in one click."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Newsletter', href: '/newsletter' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-ink-850 p-8 lg:p-12">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red/15 text-red">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-anton text-3xl uppercase tracking-tight text-white">Be first. Every time.</h2>
            <p className="mt-2 text-graphite-300">Drop your email and you’re in. It really is that simple.</p>
            <NewsletterForm className="mt-7 max-w-md" />

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-graphite-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
