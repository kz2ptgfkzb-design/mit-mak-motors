import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/page-hero';
import { FinanceApplication } from '@/components/finance/finance-application';
import { FinanceExtras } from '@/components/finance/finance-extras';
import { FinanceCalculator } from '@/components/vehicle/finance-calculator';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'Business Finance',
  description:
    'Vehicle and fleet finance for companies, close corporations, sole proprietors and trusts. Mit-Mak Motors’ dedicated business finance track.',
  alternates: { canonical: '/finance/business' },
};

function Tabs() {
  const tab = 'inline-flex h-11 items-center rounded-full px-6 font-display text-xs uppercase tracking-wide transition-colors';
  return (
    <div className="mt-8 inline-flex rounded-full border border-white/10 bg-ink-900 p-1">
      <Link href="/finance" className={cn(tab, 'text-graphite-300 hover:text-white')}>
        Individual
      </Link>
      <Link href="/finance/business" className={cn(tab, 'bg-red text-white')}>
        Business
      </Link>
    </div>
  );
}

export default function BusinessFinancePage() {
  return (
    <>
      <PageHero
        eyebrow="Business Finance"
        title="Finance for Your Fleet"
        description="From a single company car to a full fleet — structured finance for Pty Ltds, CCs, sole proprietors and trusts, with VAT-efficient options and a dedicated consultant."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Finance', href: '/finance' }, { label: 'Business', href: '/finance/business' }]}
      >
        <Tabs />
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <FinanceApplication variant="business" />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div id="calculator" className="scroll-mt-28">
              <FinanceCalculator price={689900} editablePrice />
            </div>
            <FinanceExtras variant="business" />
          </aside>
        </div>
      </section>

      <CtaBand
        eyebrow="Fleet enquiry?"
        title="Let’s build your fleet"
        description="Talk to our business desk about volume pricing, maintenance plans and structured finance across multiple vehicles."
        primary={{ label: 'Contact the Business Desk', href: '/contact' }}
        secondary={{ label: 'Browse the Showroom', href: '/showroom' }}
      />
    </>
  );
}
