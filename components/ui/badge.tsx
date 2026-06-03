import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DriveType } from '@/types';

export function Chip({
  children,
  className,
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-graphite-200',
        className,
      )}
    >
      {icon && <span className="text-graphite-400">{icon}</span>}
      {children}
    </span>
  );
}

const driveStyles: Record<DriveType, string> = {
  FWD: 'border-graphite-500/40 text-graphite-200',
  RWD: 'border-graphite-400/50 text-white',
  AWD: 'border-red/40 text-red-200',
  '4x4': 'border-red/60 text-white bg-red/10',
};

export function DriveBadge({ drive, className }: { drive: DriveType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-display text-[10px] uppercase tracking-widest',
        driveStyles[drive],
        className,
      )}
    >
      {drive}
    </span>
  );
}

type Status = 'new' | 'reserved' | 'reduced' | 'featured' | 'sold';

const statusStyles: Record<Status, string> = {
  new: 'bg-white text-ink-900',
  reserved: 'bg-ink-900/80 text-white border border-white/30 backdrop-blur',
  reduced: 'bg-red text-white shadow-glow-sm',
  featured: 'bg-red text-white',
  sold: 'bg-ink-700 text-graphite-300',
};

export function StatusBadge({ status, children, className }: { status: Status; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em]',
        statusStyles[status],
        className,
      )}
    >
      {children}
    </span>
  );
}
