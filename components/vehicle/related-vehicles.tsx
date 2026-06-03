import type { Vehicle } from '@/types';
import { relatedVehicles, toCard } from '@/data/vehicles';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { VehicleCard } from './vehicle-card';

export function RelatedVehicles({ vehicle }: { vehicle: Vehicle }) {
  const related = relatedVehicles(vehicle, 4).map(toCard);
  if (!related.length) return null;

  return (
    <section className="border-t border-white/10 py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow="Keep Looking" title="Related Vehicles" />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.06}>
              <VehicleCard vehicle={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
