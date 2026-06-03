import type { ReactNode } from 'react';
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
  return (
    <div className={cn('w-full overflow-hidden', fade && 'mask-fade-x', className)}>
      <div
        className={cn(
          'flex w-max',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${durationSec}s` }}
      >
        <div className="flex shrink-0 items-center gap-6 pr-6">{children}</div>
        <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
