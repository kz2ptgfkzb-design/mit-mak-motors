import {
  Car,
  Tag,
  Layers,
  CalendarDays,
  Gauge,
  Compass,
  Cog,
  Fuel,
  Zap,
  DoorOpen,
  Users,
  Palette,
  BadgeCheck,
  Hash,
  Boxes,
} from 'lucide-react';
import type { Vehicle } from '@/types';
import { formatMileage } from '@/lib/utils';

export function SpecGrid({ vehicle }: { vehicle: Vehicle }) {
  const specs: { label: string; value: string | number; icon: React.ReactNode }[] = [
    { label: 'Make', value: vehicle.make, icon: <Car className="h-4 w-4" /> },
    { label: 'Model', value: vehicle.model, icon: <Tag className="h-4 w-4" /> },
    { label: 'Variant', value: vehicle.variant, icon: <Layers className="h-4 w-4" /> },
    { label: 'Year', value: vehicle.year, icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'Mileage', value: formatMileage(vehicle.mileage), icon: <Gauge className="h-4 w-4" /> },
    { label: 'Body Type', value: vehicle.bodyType, icon: <Boxes className="h-4 w-4" /> },
    { label: 'Drive Type', value: vehicle.driveType, icon: <Compass className="h-4 w-4" /> },
    { label: 'Transmission', value: vehicle.transmission, icon: <Cog className="h-4 w-4" /> },
    { label: 'Fuel', value: vehicle.fuel, icon: <Fuel className="h-4 w-4" /> },
    { label: 'Engine', value: vehicle.engineSize, icon: <Zap className="h-4 w-4" /> },
    { label: 'Power', value: vehicle.power || '—', icon: <Gauge className="h-4 w-4" /> },
    { label: 'Doors', value: vehicle.doors, icon: <DoorOpen className="h-4 w-4" /> },
    { label: 'Seats', value: vehicle.seats, icon: <Users className="h-4 w-4" /> },
    { label: 'Colour', value: vehicle.color, icon: <Palette className="h-4 w-4" /> },
    { label: 'Condition', value: vehicle.condition, icon: <BadgeCheck className="h-4 w-4" /> },
    { label: 'Stock No.', value: vehicle.stockNumber, icon: <Hash className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-4">
      {specs.map((s) => (
        <div key={s.label} className="bg-ink-850 p-4">
          <div className="flex items-center gap-2 text-graphite-500">
            {s.icon}
            <span className="font-display text-[10px] uppercase tracking-[0.16em]">{s.label}</span>
          </div>
          <p className="mt-2 font-display text-base uppercase tracking-tight text-white">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
