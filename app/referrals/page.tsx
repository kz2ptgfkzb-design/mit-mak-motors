import type { Metadata } from 'next';
import { Share2, Car, Banknote } from 'lucide-react';
import { whatsappLink } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Referrals, Refer & Earn',
  description: 'Refer a friend to Mit-Mak Motors. When they buy, you both earn. Simple, generous and paid out fast.',
  alternates: { canonical: '/referrals' },
};

const steps = [
  { icon: Share2, title: 'Refer a friend', text: 'Send them our way, by WhatsApp, a quick message, or in person. Tell us who to expect.' },
  { icon: Car, title: 'They buy & take delivery', text: 'Your friend finds their car, we deliver it free, everyone’s happy.' },
  { icon: Banknote, title: 'You both get paid', text: 'You each receive a R2,000 reward once the deal is finalised. No catch.' },
];

export default function ReferralsPage() {
  return (
    <>
      <PageHero
        eyebrow="Refer & Earn"
        title="Good Cars, Shared"
        description="Know someone in the market? Refer them to Mit-Mak. When they buy, you both pocket R2,000, our way of saying thanks."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Referrals', href: '/referrals' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-ink-850 p-7">
                  <span className="font-anton text-6xl leading-none text-white/[0.07]">0{i + 1}</span>
                  <span className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-2 font-display text-lg uppercase tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-400">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-red/30 bg-gradient-to-br from-red/15 to-ink-900 p-8 text-center lg:p-12">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-red">The Reward</p>
            <p className="mt-3 font-anton text-5xl uppercase tracking-tight text-white sm:text-6xl">R2 000 each</p>
            <p className="mx-auto mt-4 max-w-md text-graphite-300">Paid to both you and your friend once their purchase is finalised. Refer as many people as you like, there’s no limit.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={whatsappLink('Hi Mit-Mak, I’d like to refer a friend.')} target="_blank" rel="noopener noreferrer" size="lg" magnetic>
                Refer via WhatsApp
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Refer via the form
              </Button>
            </div>
            <p className="mt-4 text-xs text-graphite-600">Terms apply. Reward paid after the referred purchase is settled and delivered.</p>
          </div>
        </div>
      </section>
    </>
  );
}
