import { cn } from '@/lib/utils';
import { SpeedChevrons } from './chevron';
import { Reveal, RevealText } from './reveal';

export function Eyebrow({
  children,
  className,
  center,
}: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={cn('inline-flex items-center gap-3', center && 'justify-center', className)}>
      <SpeedChevrons count={3} size={11} />
      <span className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-red">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const center = align === 'center';
  return (
    <div className={cn('max-w-3xl', center && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Reveal className={cn('mb-5', center && 'flex justify-center')}>
          <Eyebrow center={center}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <h2 className="text-4xl font-bold leading-[0.92] tracking-condensed sm:text-5xl md:text-6xl">
        <RevealText text={title} splitBy="word" stagger={0.04} />
      </h2>
      {description && (
        <Reveal delay={0.12}>
          <p className={cn('mt-6 max-w-xl text-base leading-relaxed text-graphite-300 md:text-lg', center && 'mx-auto')}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
