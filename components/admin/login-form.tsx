'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Spinner } from './ui';

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Unable to sign in.');
        setLoading(false);
        return;
      }
      window.location.href = next && next.startsWith('/admin') ? next : '/admin';
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25';

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Enter your credentials to access the dashboard.</p>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@mitmakmotors.co.za"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="Your password"
            />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-red-600/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/40 disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? <Spinner /> : <LogIn className="h-4 w-4" />}
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="mt-5 text-center">
        <Link href="/admin/forgot-password" className="text-sm font-medium text-slate-500 transition-colors hover:text-red-600">
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}
