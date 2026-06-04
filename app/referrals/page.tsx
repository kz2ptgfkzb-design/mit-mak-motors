import type { Metadata } from 'next';
import { Share2, Car, Gift, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { ReferralForm } from '@/components/referrals/referral-form';

export const metadata: Metadata = {
  title: 'Referrals, Refer a Friend',
  description:
    'Refer a friend to Mit-Mak Motors. Tell us who sent them and the car they are after, and when they drive away happy, we look after you too.',
  alternates: { canonical: '/referrals' },
};

const steps = [
  { icon: Share2, title: 'Send them our way', text: 'Tell a friend about Mit-Mak, then drop both your details in the form so we know who to thank.' },
  { icon: Car, title: 'They find their car', text: 'We help them find the right car and deliver it free, anywhere in South Africa.' },
  { icon: Gift, title: 'You get looked after', text: 'Once their purchase goes through, we say thank you. Refer as many people as you like, there is no limit.' },
];

export default function ReferralsPage() {
  return (
    <>
      <PageHero
        eyebrow="Refer a Friend"
        title="Great Service, Shared"
        description="Know someone in the market for a car? Send them to Mit-Mak. When they drive away happy, we make sure you do too."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Referrals', href: '/referrals' }]}
        image="https://img.autotrader.co.za/47508834/Crop1024x576.jpg"
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

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
                <ReferralForm />
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="rounded-2xl border border-red/30 bg-gradient-to-br from-red/15 to-ink-900 p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl uppercase tracking-tight text-white">Prefer WhatsApp?</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-300">
                  Skip the form. Send us their name and number on WhatsApp and we will take it from there, then keep you posted.
                </p>
                <a
                  href={whatsappLink('Hi Mit-Mak, I would like to refer a friend.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.08] px-6 font-display text-xs uppercase tracking-wide text-white transition-colors hover:bg-red"
                >
                  Refer via WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
