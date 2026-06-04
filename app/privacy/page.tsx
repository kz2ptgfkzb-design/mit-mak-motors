import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { PageHero } from '@/components/layout/page-hero';
import { Prose } from '@/components/ui/prose';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Mit-Mak Motors collects, uses and protects your personal information, in line with South Africa’s POPIA.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use and protect your personal information, in line with the Protection of Personal Information Act (POPIA)."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy' }]}
        image="https://img.autotrader.co.za/47096868/Crop1024x576.jpg"
      />

      <section className="py-16 lg:py-24">
        <div className="container max-w-3xl">
          <Prose>
            <p><strong>Last updated:</strong> 3 June 2026</p>
            <p>
              {siteConfig.legalName} (“Mit-Mak Motors”, “we”, “us”) respects your privacy and is committed to protecting your
              personal information. This policy explains what we collect, why, and the choices you have. It is a sample policy
              for this demonstration site and should be reviewed by a legal professional before going live.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>Contact details you give us (name, email, phone, address) via our forms.</li>
              <li>Finance application details, where you choose to apply (income, employment, ID number).</li>
              <li>Vehicle details you submit when selling or trading in.</li>
              <li>Technical data such as device, browser and usage analytics, via essential and optional cookies.</li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>To respond to enquiries, reserve vehicles and process finance or sale applications.</li>
              <li>To arrange delivery and provide customer support.</li>
              <li>To send you marketing, only where you’ve opted in, which you can stop at any time.</li>
              <li>To improve the website and our service.</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use essential cookies to run the site and optional cookies to understand usage and improve it. You can decline
              the optional ones using our cookie banner without affecting core functionality.
            </p>

            <h2>Sharing</h2>
            <p>
              We share information only as needed to deliver our service, for example, with accredited finance and insurance
              partners when you apply, or delivery partners to get your car to you. We do not sell your personal information.
            </p>

            <h2>Your rights under POPIA</h2>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction or deletion of your information.</li>
              <li>Object to processing or withdraw consent for marketing.</li>
              <li>Lodge a complaint with the Information Regulator of South Africa.</li>
            </ul>

            <h2>Contact</h2>
            <p>
              For any privacy request, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{' '}
              <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
