import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Official Mit Mak Motors emblem (transparent PNG). */
export function LogoMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/mit-mak-logo.png"
      alt="Mit Mak Motors"
      width={1198}
      height={1198}
      priority={priority}
      className={cn('w-auto object-contain', className)}
    />
  );
}

export function Logo({ className, priority = false }: { className?: string; variant?: 'full' | 'mark'; priority?: boolean }) {
  return <LogoMark className={cn('h-12', className)} priority={priority} />;
}
