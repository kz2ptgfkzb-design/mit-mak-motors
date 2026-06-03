import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Lightweight typographic wrapper (no plugin) for legal & article copy. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-none text-graphite-300',
        '[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-white',
        '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:text-white',
        '[&_p]:mb-4 [&_p]:leading-relaxed',
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5',
        '[&_li]:leading-relaxed [&_li]:marker:text-red',
        '[&_a]:text-red [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}
