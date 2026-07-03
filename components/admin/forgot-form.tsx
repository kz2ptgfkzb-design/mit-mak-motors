'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Spinner } from './ui';

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h1 className="text-xl font-semibold text-slate-900">Check your email</h1>
        <p className="mt-2 text-sm text-slate-500">
          If an account exists for {email || 'that address'}, a password reset link has been sent. The link expires
          in 1 hour.
        </p>
        {devUrl && (
          <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
            <p className="font-medium">Dev mode (no email service configured):</p>
            <Link href={devUrl} className="mt-1 block break-all underline">
              {devUrl}
            </Link>
          </div>
        )}
        <Link href="/admin/login" className="mt-6 block text-center text-sm text-slate-500 hover:text-red-600">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h1 className="text-xl font-semibold text-slate-900">Reset password</h1>
      <p className="mt-1 text-sm text-slate-500">We will email you a link to reset your password.</p>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
          placeholder="you@mitmakmotors.co.za"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        {loading && <Spinner />}
        Send reset link
      </button>
      <Link href="/admin/login" className="mt-4 block text-center text-sm text-slate-500 hover:text-red-600">
        Back to sign in
      </Link>
    </form>
  );
}
