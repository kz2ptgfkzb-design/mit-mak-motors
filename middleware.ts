import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

// Gatekeeper for the private admin area. Runs on the edge (jose only) — it
// verifies the session cookie's signature/expiry. Fine-grained RBAC is enforced
// again inside each route handler (defense in depth).

const PUBLIC_AUTH_APIS = new Set([
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
  '/api/admin/auth/forgot',
  '/api/admin/auth/reset',
]);

function isAuthPage(pathname: string): boolean {
  return (
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password'
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? await verifySessionToken(token) : null;

  // Admin API
  if (pathname.startsWith('/api/admin')) {
    if (PUBLIC_AUTH_APIS.has(pathname)) return NextResponse.next();
    if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.next();
  }

  // Admin pages
  if (pathname.startsWith('/admin')) {
    if (isAuthPage(pathname)) {
      if (claims && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }
    if (!claims) {
      const url = new URL('/admin/login', req.url);
      if (pathname !== '/admin') url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
