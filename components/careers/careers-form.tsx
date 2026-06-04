'use client';

import { useRef, useState } from 'react';
import { Loader2, UploadCloud, FileText, X } from 'lucide-react';
import { Field, TextInput } from '@/components/forms/form-controls';
import { FormSuccess } from '@/components/forms/form-success';

type Form = { firstName: string; lastName: string; email: string; confirmEmail: string; phone: string };
const EMPTY: Form = { firstName: '', lastName: '', email: '', confirmEmail: '', phone: '' };

export function CareersForm({ position }: { position: string }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.confirmEmail.trim() !== form.email.trim()) e.confirmEmail = 'Emails do not match';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!cv) e.cv = 'Please attach your CV';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    try {
      await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'careers',
          data: { ...form, position, cv: cv ? { name: cv.name, size: cv.size, type: cv.type } : null },
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
        title="Application Received"
        message="Thanks for applying. Our team reviews every CV. If you are a fit for the role, we will be in touch to set up a chat."
      />
    );
  }

  return (
    <div>
      <p className="font-display text-[11px] uppercase tracking-[0.2em] text-red">Apply now</p>
      <h3 className="mt-1 font-display text-xl uppercase tracking-tight text-white">{position}</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName}>
          <TextInput value={form.firstName} error={errors.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="First name" />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <TextInput value={form.lastName} error={errors.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Last name" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
        </Field>
        <Field label="Confirm email" required error={errors.confirmEmail}>
          <TextInput type="email" value={form.confirmEmail} error={errors.confirmEmail} onChange={(e) => update({ confirmEmail: e.target.value })} placeholder="Repeat your email" />
        </Field>
        <Field label="Phone" required error={errors.phone} className="sm:col-span-2">
          <TextInput value={form.phone} error={errors.phone} inputMode="tel" onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
      </div>

      <div className="mt-5">
        <span className="mb-2 flex items-center gap-1 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-300">
          Upload your CV <span className="text-red">*</span>
        </span>
        {cv ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-ink-900 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2 text-sm text-white">
              <FileText className="h-4 w-4 shrink-0 text-red" />
              <span className="truncate">{cv.name}</span>
            </span>
            <button type="button" onClick={() => setCv(null)} aria-label="Remove CV" className="shrink-0 text-graphite-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-cursor="hover"
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-ink-900 py-7 text-center transition-colors hover:border-red"
          >
            <UploadCloud className="h-6 w-6 text-graphite-400" />
            <span className="font-display text-sm uppercase tracking-wide text-white">Attach CV</span>
            <span className="text-xs text-graphite-500">PDF, DOC or DOCX · max 10 MB</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setCv(e.target.files?.[0] ?? null)}
        />
        {errors.cv && <p className="mt-1.5 text-xs text-red">{errors.cv}</p>}
      </div>

      <button
        onClick={submit}
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit Application
      </button>
      {status === 'error' && <p className="mt-4 text-sm text-red">Something went wrong. Please try again or email careers@mitmakmotors.co.za.</p>}
    </div>
  );
}
