'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewsletterForm({ className, dark = false }: { className?: string; dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className={cn('flex items-center gap-3 rounded-full border border-red/40 bg-red/10 px-5 py-3.5 text-sm text-white', className)}>
        <Check className="h-4 w-4 text-red" />
        You&apos;re on the list. Watch your inbox for fresh stock.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('group relative flex items-center', className)} noValidate>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        placeholder="Your email address"
        aria-label="Email address"
        className={cn(
          'h-14 w-full rounded-full border bg-transparent py-3.5 pl-5 pr-14 text-sm text-white placeholder:text-graphite-500 outline-none transition-colors',
          status === 'error' ? 'border-red' : 'border-white/15 focus:border-red',
          dark && 'bg-ink-950/60',
        )}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        disabled={status === 'loading'}
        className="absolute right-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red text-white transition-transform duration-300 ease-out-expo hover:scale-105 disabled:opacity-60"
        data-cursor="hover"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
