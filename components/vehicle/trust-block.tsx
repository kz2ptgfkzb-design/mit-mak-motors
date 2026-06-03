import { Truck, ShieldCheck, Trophy, Star } from 'lucide-react';
import { trustPoints } from '@/data/awards';

const icons = [Truck, ShieldCheck, Trophy, Star];

export function TrustBlock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-850 to-ink-900 p-7">
      <h3 className="font-anton text-3xl uppercase leading-none tracking-tight text-white">
        Trusted. <span className="text-stroke">Awarded.</span> <span className="text-red">Unmatched.</span>
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {trustPoints.map((point, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={point} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm leading-snug text-graphite-200">{point}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
