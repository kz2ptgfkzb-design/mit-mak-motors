import { cn } from '@/lib/utils';

/** Single chevron, the core brand "speed" mark. */
export function Chevron({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.45}
      viewBox="0 0 12 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M2 2L9 9L2 16" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
    </svg>
  );
}

/** A tight cluster of chevrons used as an inline accent / divider mark. */
export function SpeedChevrons({
  count = 3,
  size = 12,
  className,
}: {
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center text-red', className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Chevron key={i} size={size} className={cn('shrink-0', i > 0 && '-ml-[3px]')} />
      ))}
    </span>
  );
}

/** Decorative diagonal speed-lines, absolutely positioned by the parent. */
export function SpeedLines({ className }: { className?: string }) {
  return (
    <svg
      className={cn('pointer-events-none select-none', className)}
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={-40 + i * 30}
          y1={200}
          x2={120 + i * 30}
          y2={0}
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 2 : 1}
          opacity={0.12 + i * 0.04}
        />
      ))}
    </svg>
  );
}

/** Full-width chevron divider with a centred fade, used between sections. */
export function ChevronDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex h-8 w-full items-center justify-center overflow-hidden', className)} aria-hidden>
      <div className="mask-fade-x flex w-full items-center justify-center gap-1 text-red/40">
        {Array.from({ length: 48 }).map((_, i) => (
          <Chevron key={i} size={9} className="shrink-0" />
        ))}
      </div>
    </div>
  );
}
