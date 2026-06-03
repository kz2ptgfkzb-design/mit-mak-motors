import { cn } from '@/lib/utils';

/** Mountain "MM" mark — two red peaks meeting at centre. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 34" className={className} aria-hidden fill="none">
      <path d="M0 34 L12 4 L22 24 L22 34 Z" fill="#E10600" />
      <path d="M44 34 L32 4 L22 24 L22 34 Z" fill="#9A0400" />
      <path d="M12 4 L16 14 L8 14 Z" fill="#FF6B62" opacity="0.9" />
      <path d="M32 4 L36 14 L28 14 Z" fill="#E10600" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  className,
  variant = 'full',
}: {
  className?: string;
  variant?: 'full' | 'mark';
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-7 w-9 shrink-0" />
      {variant === 'full' && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-bold uppercase tracking-tight text-white">
            Mit-Mak
          </span>
          <span className="font-display text-[10px] uppercase tracking-[0.42em] text-graphite-400">
            Motors
          </span>
        </span>
      )}
    </span>
  );
}
