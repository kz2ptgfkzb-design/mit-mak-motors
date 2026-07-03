import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/service';
import { getStore } from '@/lib/inventory/store';
import { AdminShell } from '@/components/admin/shell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const store = getStore();
  return (
    <AdminShell user={user} backend={store.backend} persistent={store.persistent}>
      {children}
    </AdminShell>
  );
}
