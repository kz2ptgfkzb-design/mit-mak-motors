import { cn } from '@/lib/utils';
import { STATUS_LABELS, LEAD_STATUS_LABELS, type VehicleStatus, type LeadStatus } from '@/lib/inventory/types';

const VEHICLE_STYLES: Record<VehicleStatus, string> = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  reserved: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  sold: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  coming_soon: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  draft: 'bg-slate-50 text-slate-500 ring-slate-400/20',
};

const LEAD_STYLES: Record<LeadStatus, string> = {
  new: 'bg-red-50 text-red-700 ring-red-600/20',
  contacted: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  closed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  lost: 'bg-slate-100 text-slate-500 ring-slate-400/20',
};

const BASE = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';

export function VehicleStatusBadge({ status, className }: { status: VehicleStatus; className?: string }) {
  return <span className={cn(BASE, VEHICLE_STYLES[status], className)}>{STATUS_LABELS[status]}</span>;
}

export function LeadStatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return <span className={cn(BASE, LEAD_STYLES[status], className)}>{LEAD_STATUS_LABELS[status]}</span>;
}
