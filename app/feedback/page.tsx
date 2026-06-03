import type { Metadata } from 'next';
import { ThumbsUp, MessageSquareWarning, Phone } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Compliment / Complaint',
  description: 'Tell us how we did. Mit-Mak Motors takes every compliment and complaint seriously — it’s how we’ve stayed #1 on HelloPeter for 7 years.',
  alternates: { canonical: '/feedback' },
};

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="We're Listening"
        title="Compliment or Complaint"
        description="Good or bad, we want to hear it — every piece of feedback makes us sharper. It’s exactly how we’ve held #1 on HelloPeter for seven years."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Feedback', href: '/feedback' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <ContactForm prefillSubject="Feedback: " />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">
                <ThumbsUp className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg uppercase tracking-tight text-white">Got a compliment?</h3>
              <p className="mt-2 text-sm text-graphite-400">
                Made up about your experience? Tell us — and feel free to leave us a review on HelloPeter too. It means the world to the team.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">
                <MessageSquareWarning className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg uppercase tracking-tight text-white">Something wrong?</h3>
              <p className="mt-2 text-sm text-graphite-400">
                We aim to acknowledge every complaint within one business day and resolve it fast. For anything urgent, call us directly.
              </p>
              <a href={`tel:${siteConfig.phoneHref}`} className="mt-4 inline-flex items-center gap-2 font-display text-xs uppercase tracking-wide text-red">
                <Phone className="h-4 w-4" /> {siteConfig.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
