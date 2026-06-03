import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { Prose } from '@/components/ui/prose';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms governing your use of the Mit-Mak Motors website and services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms that govern your use of this website and our services. Sample content for this demonstration site."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms', href: '/terms' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="container max-w-3xl">
          <Prose>
            <p><strong>Last updated:</strong> 3 June 2026</p>
            <p>
              These terms apply to your use of the {siteConfig.name} website. By using the site you agree to them. This is sample
              content for a demonstration build and should be reviewed by a legal professional before going live.
            </p>

            <h2>Vehicle listings & pricing</h2>
            <p>
              We work hard to keep listings accurate, but specifications, availability and pricing may change without notice and
              are not an offer to sell. All sales are subject to a final agreement of sale. Images may include stock or
              illustrative photography.
            </p>

            <h2>Finance estimates</h2>
            <p>
              Any monthly figures shown by our calculator are estimates for illustration only. They do not constitute a quote or
              an offer of credit. Actual terms depend on credit approval and prevailing bank rates, and are subject to the
              National Credit Act.
            </p>

            <h2>Reservations & delivery</h2>
            <ul>
              <li>Reserving a vehicle expresses interest and does not transfer ownership until a sale is concluded.</li>
              <li>Free nationwide delivery is offered subject to our delivery terms; timelines are estimates.</li>
              <li>Every vehicle is sold with the warranty stated on its listing.</li>
            </ul>

            <h2>Promotions (FOMO Zone)</h2>
            <p>
              Raffles, auctions, merchandise and masterclasses are governed by their own specific terms published at the time of
              each promotion. Where required, competitions comply with the Consumer Protection Act.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The Mit-Mak Motors name, logo and site content are protected. You may not reproduce them without permission.
            </p>

            <h2>Liability</h2>
            <p>
              The site is provided “as is”. To the extent permitted by law, we are not liable for indirect or consequential loss
              arising from its use.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{' '}
              <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
