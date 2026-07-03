import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12 [color-scheme:light]">
      {/* Branded backdrop: red glows + faint dot grid + vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-12%] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[380px] w-[380px] rounded-full bg-red-700/15 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-9 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 scale-125 rounded-full bg-red-600/25 blur-2xl" aria-hidden />
            <Image
              src="/mit-mak-logo.png"
              alt="Mit-Mak Motors"
              width={1198}
              height={1198}
              priority
              className="relative h-24 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            />
          </div>
          <span className="mt-5 font-display text-[11px] uppercase tracking-[0.34em] text-slate-400">
            Private Inventory Management
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
