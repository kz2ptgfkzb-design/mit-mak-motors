'use client';

import { MultiStepForm, type StepDef } from '@/components/forms/multi-step-form';
import { Field, TextInput, SelectInput, TextArea, RadioCards, FileDrop } from '@/components/forms/form-controls';

type State = Record<string, string | boolean | File[]>;

const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

function required(form: State, fields: [string, string][]) {
  const e: Record<string, string> = {};
  fields.forEach(([k, l]) => {
    if (!`${form[k] ?? ''}`.trim()) e[k] = `${l} is required`;
  });
  return e;
}

const steps: StepDef<State>[] = [
  {
    id: 'car',
    title: 'Your Car',
    description: 'The basics. We’ll use these to benchmark a fair, market-related offer.',
    validate: (f) => required(f, [['make', 'Make'], ['model', 'Model'], ['year', 'Year'], ['mileage', 'Mileage']]),
    render: ({ form, update, errors }) => (
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Make" required error={errors.make}>
          <TextInput value={`${form.make ?? ''}`} error={errors.make} onChange={(e) => update({ make: e.target.value })} placeholder="e.g. Toyota" />
        </Field>
        <Field label="Model" required error={errors.model}>
          <TextInput value={`${form.model ?? ''}`} error={errors.model} onChange={(e) => update({ model: e.target.value })} placeholder="e.g. Hilux" />
        </Field>
        <Field label="Variant / Derivative">
          <TextInput value={`${form.variant ?? ''}`} onChange={(e) => update({ variant: e.target.value })} placeholder="2.8 GD-6 Legend RS 4x4" />
        </Field>
        <Field label="Year" required error={errors.year}>
          <TextInput type="number" inputMode="numeric" value={`${form.year ?? ''}`} error={errors.year} onChange={(e) => update({ year: e.target.value })} placeholder="2021" />
        </Field>
        <Field label="Mileage (km)" required error={errors.mileage}>
          <TextInput type="number" inputMode="numeric" value={`${form.mileage ?? ''}`} error={errors.mileage} onChange={(e) => update({ mileage: e.target.value })} placeholder="61000" />
        </Field>
        <Field label="Fuel">
          <SelectInput value={`${form.fuel ?? 'Petrol'}`} onChange={(e) => update({ fuel: e.target.value })} options={opt(['Petrol', 'Diesel', 'Hybrid', 'Electric'])} />
        </Field>
        <Field label="Transmission">
          <SelectInput value={`${form.transmission ?? 'Automatic'}`} onChange={(e) => update({ transmission: e.target.value })} options={opt(['Automatic', 'Manual'])} />
        </Field>
      </div>
    ),
  },
  {
    id: 'condition',
    title: 'Condition',
    description: 'Be honest, it gets you a faster, firmer offer with no surprises at handover.',
    render: ({ form, update }) => (
      <div className="space-y-6">
        <Field label="Overall condition">
          <RadioCards
            value={`${form.condition ?? 'Good'}`}
            onChange={(v) => update({ condition: v })}
            columns={3}
            options={[
              { value: 'Excellent', label: 'Excellent', description: 'Like new, no faults' },
              { value: 'Good', label: 'Good', description: 'Minor wear only' },
              { value: 'Fair', label: 'Fair', description: 'Needs some attention' },
            ]}
          />
        </Field>
        <Field label="Service history">
          <RadioCards
            value={`${form.serviceHistory ?? 'Full'}`}
            onChange={(v) => update({ serviceHistory: v })}
            columns={3}
            options={[
              { value: 'Full', label: 'Full' },
              { value: 'Partial', label: 'Partial' },
              { value: 'None', label: 'None' },
            ]}
          />
        </Field>
        <Field label="Is the vehicle accident-free?">
          <RadioCards
            value={`${form.accidentFree ?? 'Yes'}`}
            onChange={(v) => update({ accidentFree: v })}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No / repaired' },
            ]}
          />
        </Field>
        <Field label="Anything else we should know?">
          <TextArea value={`${form.notes ?? ''}`} onChange={(e) => update({ notes: e.target.value })} placeholder="Extras, tow bar, outstanding finance, tyres, etc." />
        </Field>
      </div>
    ),
  },
  {
    id: 'photos',
    title: 'Photos',
    description: 'Optional, but photos get you a sharper offer faster. Front, rear, sides, interior & dash.',
    render: ({ form, update }) => (
      <FileDrop files={(form.photos as File[]) || []} onChange={(files) => update({ photos: files })} />
    ),
  },
  {
    id: 'details',
    title: 'Your Offer',
    description: 'Where should we send your cash offer? We’ll call you back, usually within the hour.',
    validate: (f) => {
      const e = required(f, [['name', 'Name'], ['mobile', 'Mobile']]);
      const email = `${f.email ?? ''}`;
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email address';
      if (!f.consent) e.consent = 'Please give consent so we can contact you';
      return e;
    },
    render: ({ form, update, errors }) => (
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name}>
            <TextInput value={`${form.name ?? ''}`} error={errors.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" />
          </Field>
          <Field label="Mobile" required error={errors.mobile}>
            <TextInput value={`${form.mobile ?? ''}`} error={errors.mobile} onChange={(e) => update({ mobile: e.target.value })} placeholder="082 000 0000" />
          </Field>
          <Field label="Email" error={errors.email}>
            <TextInput type="email" value={`${form.email ?? ''}`} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
          </Field>
          <Field label="Best time to call">
            <SelectInput value={`${form.callTime ?? 'Anytime'}`} onChange={(e) => update({ callTime: e.target.value })} options={opt(['Anytime', 'Morning', 'Afternoon', 'After hours'])} />
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
          <input type="checkbox" checked={!!form.consent} onChange={(e) => update({ consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-red" />
          <span className="text-sm text-graphite-300">I’d like a cash offer and consent to Mit-Mak Motors contacting me about my vehicle.</span>
        </label>
        {errors.consent && <p className="text-xs text-red">{errors.consent}</p>}
      </div>
    ),
  },
];

export function SellForm() {
  return (
    <MultiStepForm<State>
      steps={steps}
      initial={{ fuel: 'Petrol', transmission: 'Automatic', condition: 'Good', serviceHistory: 'Full', accidentFree: 'Yes', consent: false, photos: [] }}
      endpoint="/api/sell"
      formType="sell-car"
      submitLabel="Get My Cash Offer"
      successTitle="Offer on the Way"
      successMessage="We’ve got your details, expect a call from our buying team shortly, usually within the hour, with your best cash price."
    />
  );
}
