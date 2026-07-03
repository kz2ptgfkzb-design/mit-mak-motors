'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Inbox,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  TriangleAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SafeUser } from '@/lib/inventory/types';
import { ROLE_LABELS } from '@/lib/inventory/types';
import { can, type Permission } from '@/lib/auth/rbac';
import { AdminUXProvider } from './providers';

interface NavItem {
  href: string;
  label: string;
  icon: typeof Car;
  permission?: Permission;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/vehicles', label: 'Vehicles', icon: Car, permission: 'vehicle:view' },
  { href: '/admin/leads', label: 'Enquiries', icon: Inbox, permission: 'lead:view' },
  { href: '/admin/users', label: 'Users', icon: Users, permission: 'user:manage' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, permission: 'settings:manage' },
];

export function AdminShell({
  user,
  backend,
  persistent,
  children,
}: {
  user: SafeUser;
  backend: 'postgres' | 'file';
  persistent: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = NAV.filter((n) => !n.permission || can(user.role, n.permission));

  const isActive = (n: NavItem) => (n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(`${n.href}/`));

  async function logout() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin/login';
    }
  }

  const sidebar = (
    <div className="relative flex h-full flex-col bg-ink-950 text-slate-300">
      {/* subtle brand glow behind the logo */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-40 w-56 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
      <div className="relative px-5 pb-4 pt-6">
        <Image
          src="/mit-mak-logo.png"
          alt="Mit-Mak Motors"
          width={1198}
          height={1198}
          priority
          className="h-12 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
        />
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Inventory Console</p>
      </div>
      <div className="relative mx-5 mb-2 h-px bg-white/10" />
      <nav className="relative flex-1 space-y-1 px-3 py-2">
        {items.map((n) => {
          const Icon = n.icon;
          const active = isActive(n);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View live site
        </Link>
        <div className="rounded-lg bg-white/5 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-white">{user.name || user.email}</p>
          <p className="text-xs text-slate-400">{ROLE_LABELS[user.role]}</p>
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminUXProvider>
      <div className="min-h-screen bg-slate-100 [color-scheme:light]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute right-2 top-4 z-10 rounded-md p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <div className="lg:pl-64">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-slate-500 lg:hidden">Mit-Mak Admin</span>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium',
                  backend === 'postgres' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', backend === 'postgres' ? 'bg-emerald-500' : 'bg-amber-500')} />
                {backend === 'postgres' ? 'Database connected' : 'Demo mode'}
              </span>
            </div>
          </header>

          {!persistent && (
            <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 lg:px-8">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Demo mode: changes are stored temporarily and are not saved permanently. Connect a database
                (add the Postgres environment variables) to make the inventory live and persistent.
              </p>
            </div>
          )}

          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </AdminUXProvider>
  );
}
