'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { featuredVehicles } from '@/data/vehicles';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/magnetic';

export function FeaturedInventory() {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const suppressClick = useRef(false);

  function onPointerDown(e: React.PointerEvent) {
    if (!scroller.current || e.pointerType === 'touch') return;
    drag.current = { active: true, startX: e.clientX, startScroll: scroller.current.scrollLeft, moved: 0 };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active || !scroller.current) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    scroller.current.scrollLeft = drag.current.startScroll - dx;
  }
  function onPointerUp() {
    if (drag.current.active && drag.current.moved > 8) suppressClick.current = true;
    drag.current.active = false;
  }
  function onClickCapture(e: React.MouseEvent) {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  }
  function nudge(dir: number) {
    scroller.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  }

  return (
    <section className="py-24 lg:py-32" aria-label="Featured inventory">
      <div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="The Showroom"
          title="Featured Inventory"
          description="Hand-picked, fully reconditioned and ready to drive. Drag to explore, or open the full showroom."
        />
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Magnetic>
            <button
              onClick={() => nudge(-1)}
              aria-label="Previous"
              data-cursor="hover"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-red hover:bg-red"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => nudge(1)}
              aria-label="Next"
              data-cursor="hover"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-red hover:bg-red"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
          <Button href="/showroom" variant="outline">
            View all
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        data-cursor="drag"
        data-cursor-text="Drag"
        className="hide-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-8 select-none active:cursor-grabbing sm:px-8 lg:px-[max(2rem,calc((100vw-1400px)/2+3.5rem))]"
      >
        {featuredVehicles.map((v, i) => (
          <div key={v.id} className="w-[300px] shrink-0 snap-start sm:w-[350px]">
            <VehicleCard vehicle={v} priority={i < 2} />
          </div>
        ))}
      </div>

      <div className="container mt-6 md:hidden">
        <Button href="/showroom" variant="outline" arrow className="w-full justify-center">
          View all stock
        </Button>
      </div>
    </section>
  );
}
