import { Trophy } from 'lucide-react';
import { awards } from '@/data/awards';
import { Marquee } from '@/components/ui/marquee';
import type { Award } from '@/types';

function AwardBadge({ award }: { award: Award }) {
  return (
    <div className="group relative flex items-center gap-3.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5">
      <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />
      <Trophy className="h-5 w-5 shrink-0 text-red" />
      <div className="whitespace-nowrap">
        <p className="font-display text-sm uppercase leading-none tracking-tight text-white">{award.title}</p>
        <p className="mt-1 text-[11px] text-graphite-400">
          {award.subtitle}
          {award.year ? ` · ${award.year}` : ''}
        </p>
      </div>
    </div>
  );
}

export function AwardsMarquee() {
  const top = awards;
  const bottom = [...awards].reverse();
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink-900 py-10" aria-label="Awards and accreditations">
      <div className="container mb-8 flex items-center justify-between gap-4">
        <p className="font-display text-[11px] uppercase tracking-[0.28em] text-graphite-400">The Trophy Cabinet</p>
        <p className="hidden text-sm text-graphite-500 sm:block">Earned, not claimed.</p>
      </div>
      <div className="flex flex-col gap-4">
        <Marquee durationSec={46}>
          {top.map((a) => (
            <AwardBadge key={a.id} award={a} />
          ))}
        </Marquee>
        <Marquee durationSec={52} reverse>
          {bottom.map((a) => (
            <AwardBadge key={`r-${a.id}`} award={a} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
