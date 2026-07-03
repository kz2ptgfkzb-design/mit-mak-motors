'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { CustomCursor } from '@/components/providers/custom-cursor';
import { Header } from '@/components/layout/header';
import { QuickActions } from '@/components/layout/quick-actions';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { IgnitionIntro } from '@/components/home/ignition-intro';

/**
 * Renders the public site chrome (Lenis smooth scroll, header, footer, cursor,
 * intro, etc.) for every route EXCEPT the private admin area, which brings its
 * own light dashboard shell. `footer` is passed through as a slot so it can stay
 * a server component.
 */
export function SiteFrame({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return <>{children}</>;

  return (
    <>
      <IgnitionIntro />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-red focus:px-5 focus:py-2 focus:font-display focus:text-sm focus:uppercase focus:text-white"
      >
        Skip to content
      </a>
      <SmoothScroll>
        <ScrollProgress />
        <CustomCursor />
        <Header />
        <main id="main">{children}</main>
        {footer}
        <QuickActions />
        <CookieBanner />
      </SmoothScroll>
    </>
  );
}
