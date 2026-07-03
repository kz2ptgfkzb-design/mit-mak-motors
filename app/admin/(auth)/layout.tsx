import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight text-white">
            MIT-MAK<span className="text-red-500">.</span> MOTORS
          </span>
          <p className="mt-1 text-sm text-slate-400">Private Inventory Management</p>
        </div>
        {children}
      </div>
    </div>
  );
}
