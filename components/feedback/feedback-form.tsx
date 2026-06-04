'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Field, TextInput, TextArea, RadioCards, FileDrop } from '@/components/forms/form-controls';
import { FormSuccess } from '@/components/forms/form-success';

type Form = { firstName: string; lastName: string; phone: string; email: string; reason: string; message: string };
const EMPTY: Form = { firstName: '', lastName: '', phone: '', email: '', reason: 'Compliment', message: '' };

export function FeedbackForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Please tell us what happened';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback',
          data: { ...form, attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })) },
        }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <FormSuccess
        title={form.reason === 'Complaint' ? 'Complaint Received' : 'Thank You'}
        message={
          form.reason === 'Complaint'
            ? 'We are on it. A manager will acknowledge your complaint within one business day and work to put it right.'
            : 'Thank you for the kind words. We will pass them straight to the team, it means the world to them.'
        }
      />
    );
  }

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName}>
          <TextInput value={form.firstName} error={errors.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="First name" />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <TextInput value={form.lastName} error={errors.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Last name" />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <TextInput value={form.phone} error={errors.phone} inputMode="tel" onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
        </Field>
      </div>

      <div className="mt-5">
        <span className="mb-2 flex items-center gap-1 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-300">
          Reason <span className="text-red">*</span>
        </span>
        <RadioCards
          value={form.reason}
          onChange={(v) => update({ reason: v })}
          options={[
            { value: 'Compliment', label: 'Compliment', description: 'Someone went above and beyond' },
            { value: 'Complaint', label: 'Complaint', description: 'Something we need to put right' },
          ]}
        />
      </div>

      <Field label="Tell us what happened" required error={errors.message} className="mt-5">
        <TextArea
          value={form.message}
          error={errors.message}
          onChange={(e) => update({ message: e.target.value })}
          placeholder="Describe your compliment or complaint in as much detail as you like."
          className="min-h-36"
        />
      </Field>

      <div className="mt-5">
        <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.16em] text-graphite-300">Attachments (optional)</span>
        <FileDrop files={files} onChange={setFiles} max={2} />
      </div>

      <button
        onClick={submit}
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send Feedback
      </button>
      {status === 'error' && <p className="mt-4 text-sm text-red">Something went wrong. Please try again or call us.</p>}
    </div>
  );
}
