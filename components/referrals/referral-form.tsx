'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Field, TextInput } from '@/components/forms/form-controls';
import { FormSuccess } from '@/components/forms/form-success';

type Form = {
  refFirst: string;
  refLast: string;
  refPhone: string;
  firstName: string;
  lastName: string;
  phone: string;
  car: string;
};

const EMPTY: Form = { refFirst: '', refLast: '', refPhone: '', firstName: '', lastName: '', phone: '', car: '' };

export function ReferralForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!form.refFirst.trim()) e.refFirst = 'Required';
    if (!form.refLast.trim()) e.refLast = 'Required';
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.car.trim()) e.car = 'Tell us which car you are after';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    try {
      await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'referral', data: form }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <FormSuccess
        title="Referral Received"
        message="Thanks. We have logged who sent you and we will be in touch about the car you are after. When the deal goes through, the reward is on us."
      />
    );
  }

  return (
    <div>
      <p className="font-display text-[11px] uppercase tracking-[0.2em] text-red">Who referred you</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Field label="First name" required error={errors.refFirst}>
          <TextInput value={form.refFirst} error={errors.refFirst} onChange={(e) => update({ refFirst: e.target.value })} placeholder="Their first name" />
        </Field>
        <Field label="Last name" required error={errors.refLast}>
          <TextInput value={form.refLast} error={errors.refLast} onChange={(e) => update({ refLast: e.target.value })} placeholder="Their last name" />
        </Field>
        <Field label="Their phone" className="sm:col-span-2">
          <TextInput value={form.refPhone} inputMode="tel" onChange={(e) => update({ refPhone: e.target.value })} placeholder="082 000 0000 (optional)" />
        </Field>
      </div>

      <p className="mt-8 font-display text-[11px] uppercase tracking-[0.2em] text-red">Your details</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName}>
          <TextInput value={form.firstName} error={errors.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="Your first name" />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <TextInput value={form.lastName} error={errors.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Your last name" />
        </Field>
        <Field label="Your phone" required error={errors.phone}>
          <TextInput value={form.phone} error={errors.phone} inputMode="tel" onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Car you are interested in" required error={errors.car}>
          <TextInput value={form.car} error={errors.car} onChange={(e) => update({ car: e.target.value })} placeholder="e.g. BMW 3 Series" />
        </Field>
      </div>

      <button
        onClick={submit}
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit Referral
      </button>
      {status === 'error' && <p className="mt-4 text-sm text-red">Something went wrong. Please try again or WhatsApp us.</p>}
    </div>
  );
}
