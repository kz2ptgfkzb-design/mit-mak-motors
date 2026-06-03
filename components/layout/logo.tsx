import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Official Mit Mak Motors emblem (transparent PNG). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/mit-mak-logo.png"
      alt="Mit Mak Motors"
      width={1198}
      height={1198}
      className={cn('w-auto object-contain', className)}
    />
  );
}

export function Logo({ className }: { className?: string; variant?: 'full' | 'mark' }) {
  return <LogoMark className={cn('h-12', className)} />;
}
