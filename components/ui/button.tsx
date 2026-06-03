'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Magnetic } from './magnetic';

type Variant = 'primary' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-display uppercase tracking-wide leading-none transition-[box-shadow,transform,background-color,color] duration-300 ease-out-expo select-none disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-red text-white hover:shadow-glow hover:-translate-y-0.5',
  outline:
    'border border-white/25 text-white hover:border-red hover:text-white hover:shadow-glow-sm bg-white/0 hover:bg-red/10',
  ghost: 'text-graphite-200 hover:text-white',
  light: 'bg-white text-ink-900 hover:bg-graphite-100 hover:-translate-y-0.5 hover:shadow-glow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-12 px-6 text-xs',
  lg: 'h-14 px-8 text-sm',
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  'aria-label'?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  magnetic = false,
  className,
  href,
  ...rest
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {variant === 'primary' && (
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 ease-out-expo group-hover:translate-x-full" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
        )}
      </span>
    </>
  );

  const Comp: any = href ? Link : 'button';
  const el = (
    <Comp href={href} className={cls} data-cursor="hover" {...rest}>
      {content}
    </Comp>
  );

  return magnetic ? <Magnetic className="inline-block">{el}</Magnetic> : el;
}
