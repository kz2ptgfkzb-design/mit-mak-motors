'use client';

import { useRef, type ReactNode } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Seamless infinite marquee. Renders children twice for a clean loop. */
export function Marquee({
  children,
  reverse = false,
  durationSec = 40,
  className,
  pauseOnHover = true,
  fade = true,
}: {
  children: ReactNode;
  reverse?: boolean;
  durationSec?: number;
  className?: string;
  pauseOnHover?: boolean;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Pause the CSS animation while the marquee is off-screen to save compositor work.
  const inView = useInView(ref, { margin: '200px' });

  return (
    <div ref={ref} className={cn('w-full overflow-hidden', fade && 'mask-fade-x', className)}>
      <div
        className={cn(
          'flex w-max',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{
          animationDuration: `${durationSec}s`,
          ...(!inView && { animationPlayState: 'paused' }),
        }}
      >
        <div className="flex shrink-0 items-center gap-6 pr-6">{children}</div>
        <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
