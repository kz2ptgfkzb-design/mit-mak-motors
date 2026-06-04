'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { Field, TextInput } from '@/components/forms/form-controls';

type Form = {
  name: string;
  surname: string;
  idNumber: string;
  phone: string;
  vehicleDescription: string;
  salesExec: string;
  acceptTerms: boolean;
  acceptConsent: boolean;
};

const EMPTY: Form = {
  name: '',
  surname: '',
  idNumber: '',
  phone: '',
  vehicleDescription: '',
  salesExec: '',
  acceptTerms: false,
  acceptConsent: false,
};

const TERMS_INTRO =
  'Premiums subject to change should the insured item change. Pro-rata and the first-month premium will be deducted from your personal account and refunded within 7 working days ( thereafter premiums will be deducted from your own account).';

const TERMS_POINTS = [
  'King Price is a registered non-life insurer and FSP: 43862',
  'This does not count as financial advice and Mit-Mak Motors has an active lead referral agreement with King Price Insurance Company Limited.',
  'The pro-rata premium and the first full premium must be successfully collected from you in order to enjoy cover. No premium = No cover',
];

const CONSENT =
  'I/We Do Hereby Give Mit-Mak Motors Consent to Give My/ Our Personal Information to King Price Insurance for an Insurance Quotation. I/ We Will Confirm with King Price Insurance That the Information given by Mit-Mak Motors Is True and Correct. I/ We Hereby Understand That Mit-Mak Motors Will Not Be Liable for Any Claims, Excess Payable or Any Premiums after the 1st Month That Mit-Mak Motors Has Sponsored to Me/ Us. This Is Subject to the Terms and Conditions of King Price Short Term Insurance.';

export function KingPriceForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.surname.trim()) e.surname = 'Surname is required';
    if (!form.idNumber.trim()) e.idNumber = 'ID number is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.vehicleDescription.trim()) e.vehicleDescription = 'Vehicle description is required';
    if (!form.acceptTerms) e.acceptTerms = 'Please accept the terms to continue';
    if (!form.acceptConsent) e.acceptConsent = 'Please give consent to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    try {
      await fetch('/api/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'king-price-insurance', data: form }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red shadow-glow">
          <Check className="h-8 w-8 text-white" />
        </span>
        <h3 className="mt-6 font-anton text-3xl uppercase tracking-tight text-white">Quote Request Received</h3>
        <p className="mx-auto mt-3 max-w-md text-graphite-300">
          Thanks. Your details are on the way to King Price via Mit-Mak Motors. A consultant will be in touch about your sponsored
          first month of cover.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red/15 text-red">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.16em] text-red">King Price Insurance</p>
          <h2 className="font-display text-2xl uppercase tracking-tight text-white">1 Month Free Cover</h2>
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wide text-graphite-400">
        Insurance for a month sponsored by Mit-Mak Motors, underwritten by King Price Insurance, subject to King Price Insurance
        underwriting criteria.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <TextInput value={form.name} error={errors.name} onChange={(e) => update({ name: e.target.value })} placeholder="First name" />
        </Field>
        <Field label="Surname" required error={errors.surname}>
          <TextInput value={form.surname} error={errors.surname} onChange={(e) => update({ surname: e.target.value })} placeholder="Last name" />
        </Field>
        <Field label="ID Number" required error={errors.idNumber}>
          <TextInput value={form.idNumber} error={errors.idNumber} inputMode="numeric" onChange={(e) => update({ idNumber: e.target.value })} placeholder="13-digit SA ID" />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <TextInput value={form.phone} error={errors.phone} inputMode="tel" onChange={(e) => update({ phone: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Vehicle Description" required error={errors.vehicleDescription} className="sm:col-span-2">
          <TextInput value={form.vehicleDescription} error={errors.vehicleDescription} onChange={(e) => update({ vehicleDescription: e.target.value })} placeholder="e.g. 2019 VW Polo 1.0 TSI Comfortline" />
        </Field>
        <Field label="Sales Executive's Name" className="sm:col-span-2">
          <TextInput value={form.salesExec} onChange={(e) => update({ salesExec: e.target.value })} placeholder="Who is helping you (optional)" />
        </Field>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={(e) => update({ acceptTerms: e.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 accent-red"
          />
          <div className="space-y-2 text-xs leading-relaxed text-graphite-300">
            <span className="block font-display text-[11px] uppercase tracking-wide text-white">
              Terms <span className="text-red">*</span>
            </span>
            <p>{TERMS_INTRO}</p>
            <ul className="space-y-1">
              {TERMS_POINTS.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-red">-</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </label>
        {errors.acceptTerms && <p className="mt-1.5 text-xs text-red">{errors.acceptTerms}</p>}
      </div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
          <input
            type="checkbox"
            checked={form.acceptConsent}
            onChange={(e) => update({ acceptConsent: e.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 accent-red"
          />
          <div className="space-y-2 text-xs leading-relaxed text-graphite-300">
            <span className="block font-display text-[11px] uppercase tracking-wide text-white">
              Consent <span className="text-red">*</span>
            </span>
            <p>{CONSENT}</p>
          </div>
        </label>
        {errors.acceptConsent && <p className="mt-1.5 text-xs text-red">{errors.acceptConsent}</p>}
      </div>

      <button
        onClick={submit}
        disabled={status === 'submitting'}
        data-cursor="hover"
        className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Request my quote
      </button>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red">Something went wrong submitting. Please try again or call us on +27 12 546 5878.</p>
      )}
    </div>
  );
}
