'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Field, TextInput, TextArea, SelectInput } from '@/components/forms/form-controls';
import { FormSuccess } from '@/components/forms/form-success';

type Form = { name: string; email: string; phone: string; course: string; message: string };

export function MasterclassEnquiry({ courses }: { courses: string[] }) {
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '', course: courses[0] ?? '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    try {
      await fetch('/api/masterclass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'masterclass', data: form }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <FormSuccess
        title="You're on the List"
        message="Thanks. The Masterclass team will reach out with dates, pricing and the next steps for the programme you picked."
      />
    );
  }

  const courseOptions = [...courses, 'Not sure yet'].map((c) => ({ value: c, label: c }));

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name}>
          <TextInput value={form.name} error={errors.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <TextInput value={form.phone} error={errors.phone} inputMode="tel" onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
        </Field>
        <Field label="Programme of interest">
          <SelectInput value={form.course} onChange={(e) => update({ course: e.target.value })} options={courseOptions} />
        </Field>
        <Field label="Anything else?" className="sm:col-span-2">
          <TextArea value={form.message} onChange={(e) => update({ message: e.target.value })} placeholder="Tell us about your business or what you want to get out of it." className="min-h-28" />
        </Field>
      </div>
      <button
        onClick={submit}
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Register My Interest
      </button>
      {status === 'error' && <p className="mt-4 text-sm text-red">Something went wrong. Please try again or call us.</p>}
    </div>
  );
}
