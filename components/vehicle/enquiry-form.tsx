'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Vehicle } from '@/types';

type Kind = 'general' | 'test_drive' | 'callback';

const OPTIONS: { value: Kind; label: string }[] = [
  { value: 'general', label: 'Enquire' },
  { value: 'test_drive', label: 'Book a test drive' },
  { value: 'callback', label: 'Request a callback' },
];

export function EnquiryForm({ vehicle }: { vehicle: Vehicle }) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`.replace(/\s+/g, ' ').trim();
  const [kind, setKind] = useState<Kind>('general');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name,
          phone,
          email,
          message,
          vehicleSlug: vehicle.slug,
          vehicleTitle: title,
          locationId: vehicle.locationId,
          _hp: hp,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Something went wrong.');
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-850 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red/15">
          <Check className="h-6 w-6 text-red" />
        </div>
        <p className="font-display text-lg uppercase tracking-tight text-white">Thank you, {name.split(' ')[0] || 'there'}</p>
        <p className="mt-1.5 text-sm text-graphite-300">
          We have your enquiry about the {title}. A Mit-Mak consultant will be in touch shortly.
        </p>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-white placeholder:text-graphite-500 focus:border-red/60 focus:outline-none focus:ring-1 focus:ring-red/40';

  return (
    <form onSubmit={onSubmit} id="enquire" className="rounded-2xl border border-white/10 bg-ink-850 p-6">
      <h2 className="font-display text-xl uppercase tracking-tight text-white">Enquire about this car</h2>
      <p className="mt-1 text-sm text-graphite-400">Send a message about the {title} and we will get back to you.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setKind(o.value)}
            className={`rounded-full border px-3.5 py-1.5 font-display text-[11px] uppercase tracking-wide transition-colors ${
              kind === o.value ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-300 hover:border-white/40'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputCls} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className={`${inputCls} sm:col-span-2`}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={kind === 'callback' ? 'Best time to call?' : 'Your message (optional)'}
          rows={3}
          className={`${inputCls} sm:col-span-2`}
        />
      </div>

      {/* Honeypot */}
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {status === 'error' && <p className="mt-3 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-red font-display text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Send enquiry'}
      </button>
    </form>
  );
}
