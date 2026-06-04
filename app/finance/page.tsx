import type { Metadata } from 'next';
import Link from 'next/link';
import { getVehicle } from '@/data/vehicles';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/page-hero';
import { FinanceApplication } from '@/components/finance/finance-application';
import { FinanceExtras } from '@/components/finance/finance-extras';
import { KingPriceForm } from '@/components/finance/king-price-form';
import { FinanceCalculator } from '@/components/vehicle/finance-calculator';
import { CtaBand } from '@/components/layout/cta-band';

export const metadata: Metadata = {
  title: 'Apply for Finance',
  description:
    'Apply for vehicle finance with Mit-Mak Motors. One application, every major bank, pre-approval within a day. Free credit score and King Price Insurance.',
  alternates: { canonical: '/finance' },
};

function Tabs({ active }: { active: 'individual' | 'business' }) {
  const tab = 'inline-flex h-11 items-center rounded-full px-6 font-display text-xs uppercase tracking-wide transition-colors';
  return (
    <div className="mt-8 inline-flex rounded-full border border-white/10 bg-ink-900 p-1">
      <Link href="/finance" className={cn(tab, active === 'individual' ? 'bg-red text-white' : 'text-graphite-300 hover:text-white')}>
        Individual
      </Link>
      <Link href="/finance/business" className={cn(tab, active === 'business' ? 'bg-red text-white' : 'text-graphite-300 hover:text-white')}>
        Business
      </Link>
    </div>
  );
}

export default function FinancePage({ searchParams }: { searchParams: { vehicle?: string } }) {
  const vehicle = searchParams.vehicle ? getVehicle(searchParams.vehicle) : undefined;
  const price = vehicle?.price ?? 549900;
  const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}` : '';

  return (
    <>
      <PageHero
        eyebrow="Vehicle Finance"
        title="Apply in Minutes"
        description="One application. Every major bank. We do the legwork to land you the best rate, with pre-approval, most applicants hear back within one business day."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Finance', href: '/finance' }]}
        image="https://img.autotrader.co.za/47517076/Crop1024x576.jpg"
      >
        <Tabs active="individual" />
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <FinanceApplication variant="individual" vehicleName={vehicleName} />
            </div>
            <div id="insurance" className="scroll-mt-28 rounded-2xl border border-white/10 bg-ink-850 p-6 lg:p-8">
              <KingPriceForm />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div id="calculator" className="scroll-mt-28">
              <FinanceCalculator price={price} editablePrice />
            </div>
            <FinanceExtras variant="individual" />
          </aside>
        </div>
      </section>

      <CtaBand
        eyebrow="Prefer to talk?"
        title="Our finance house is open"
        description="Pop in to the Mit-Mak Finance House on Gerrit Maritz Street, or send a WhatsApp, René and the team will sort you out."
        primary={{ label: 'Contact Finance', href: '/contact' }}
        secondary={{ label: 'Browse the Showroom', href: '/showroom' }}
      />
    </>
  );
}
