import Link from 'next/link';
import { Activity, ShieldCheck, Building2, User, ArrowUpRight } from 'lucide-react';

function Card({
  id,
  icon,
  title,
  blurb,
  cta,
  href,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  blurb: string;
  cta: string;
  href: string;
}) {
  return (
    <div id={id} className="scroll-mt-28 rounded-2xl border border-white/10 bg-ink-850 p-6">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red/15 text-red">{icon}</span>
      <h3 className="mt-4 font-display text-lg uppercase tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-graphite-300">{blurb}</p>
      <Link
        href={href}
        data-cursor="hover"
        className="group mt-4 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wide text-red"
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export function FinanceExtras({ variant }: { variant: 'individual' | 'business' }) {
  return (
    <>
      <Card
        id="credit-score"
        icon={<Activity className="h-5 w-5" />}
        title="Free Credit Score"
        blurb="Know where you stand before you apply. Check your score for free, no impact on your record."
        cta="Check my score"
        href="/finance#credit-score"
      />
      <Card
        icon={<ShieldCheck className="h-5 w-5" />}
        title="King Price Insurance"
        blurb="One month of cover sponsored by Mit-Mak, then premiums that decrease as your car’s value does. Underwritten by King Price."
        cta="Get an insurance quote"
        href="/finance#insurance"
      />
      {variant === 'individual' ? (
        <Card
          icon={<Building2 className="h-5 w-5" />}
          title="Buying through a business?"
          blurb="Companies, CCs, sole proprietors and trusts, we have a dedicated business finance track."
          cta="Business finance"
          href="/finance/business"
        />
      ) : (
        <Card
          icon={<User className="h-5 w-5" />}
          title="Applying as an individual?"
          blurb="Single-applicant finance with a 60-second start and pre-approval within one business day."
          cta="Personal finance"
          href="/finance"
        />
      )}
    </>
  );
}
