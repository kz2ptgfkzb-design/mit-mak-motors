'use client';

import { useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';
import { locations } from '@/data/locations';
import { Field, TextInput, TextArea, SelectInput } from '@/components/forms/form-controls';

export function ContactForm({ prefillSubject = '', prefillMessage = '' }: { prefillSubject?: string; prefillMessage?: string }) {
  const [form, setForm] = useState<Record<string, string | boolean>>({
    name: '',
    email: '',
    phone: '',
    branch: locations[0].id,
    subject: prefillSubject,
    message: prefillMessage,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  function update(patch: Record<string, string | boolean>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!`${form.name}`.trim()) err.name = 'Name is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(`${form.email}`)) err.email = 'Enter a valid email';
    if (!`${form.message}`.trim()) err.message = 'Tell us how we can help';
    if (!form.consent) err.consent = 'Please give consent so we can reply';
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    setStatus('submitting');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', data: form }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-red/30 bg-ink-850 p-10 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-red shadow-glow">
          <Check className="h-7 w-7 text-white" />
        </span>
        <h3 className="mt-5 font-anton text-2xl uppercase tracking-tight text-white">Message sent</h3>
        <p className="mt-2 text-graphite-300">Thanks, we’ll be in touch shortly. For anything urgent, give us a call or WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <TextInput value={`${form.name}`} error={errors.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" />
        </Field>
        <Field label="Phone">
          <TextInput value={`${form.phone}`} onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={`${form.email}`} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
        </Field>
        <Field label="Branch">
          <SelectInput value={`${form.branch}`} onChange={(e) => update({ branch: e.target.value })} options={locations.map((l) => ({ value: l.id, label: l.name }))} />
        </Field>
      </div>
      <Field label="Subject">
        <TextInput value={`${form.subject}`} onChange={(e) => update({ subject: e.target.value })} placeholder="What’s this about?" />
      </Field>
      <Field label="Message" required error={errors.message}>
        <TextArea value={`${form.message}`} error={errors.message} onChange={(e) => update({ message: e.target.value })} placeholder="How can we help?" />
      </Field>
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={!!form.consent} onChange={(e) => update({ consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-red" />
        <span className="text-sm text-graphite-400">I consent to Mit-Mak Motors contacting me in response to this message.</span>
      </label>
      {errors.consent && <p className="text-xs text-red">{errors.consent}</p>}
      {status === 'error' && <p className="text-sm text-red">Something went wrong. Please call or WhatsApp us instead.</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  );
}
