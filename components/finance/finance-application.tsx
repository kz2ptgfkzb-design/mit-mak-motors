'use client';

import { getVehicle } from '@/data/vehicles';
import { TERM_OPTIONS } from '@/lib/finance';
import { MultiStepForm, type StepDef } from '@/components/forms/multi-step-form';
import { Field, TextInput, SelectInput, RadioCards } from '@/components/forms/form-controls';

type State = Record<string, string | boolean>;

const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
const TERMS = TERM_OPTIONS.map((t) => ({ value: `${t}`, label: `${t} months` }));

function required(form: State, fields: [string, string][]) {
  const e: Record<string, string> = {};
  fields.forEach(([k, l]) => {
    if (!`${form[k] ?? ''}`.trim()) e[k] = `${l} is required`;
  });
  return e;
}
function emailCheck(form: State, e: Record<string, string>, key = 'email') {
  const val = `${form[key] ?? ''}`;
  if (val && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) e[key] = 'Enter a valid email address';
  return e;
}

export function FinanceApplication({ variant, vehicleSlug }: { variant: 'individual' | 'business'; vehicleSlug?: string }) {
  const vehicle = vehicleSlug ? getVehicle(vehicleSlug) : undefined;
  const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}` : '';

  const initial: State = {
    vehicleOfInterest: vehicleName,
    term: '72',
    consent: false,
    marketing: true,
  };

  const consentStep: StepDef<State> = {
    id: 'consent',
    title: 'Review & Consent',
    description: 'Final step — confirm and submit. We’ll match you to the best rate across every major bank.',
    validate: (f): Record<string, string> => (f.consent ? {} : { consent: 'Please give consent to proceed' }),
    render: ({ form, update, errors }) => (
      <div className="space-y-5">
        <Field label="Vehicle of interest">
          <TextInput value={`${form.vehicleOfInterest ?? ''}`} onChange={(e) => update({ vehicleOfInterest: e.target.value })} placeholder="Any car from our showroom" />
        </Field>
        <Field label="Deposit available (R)">
          <TextInput type="number" inputMode="numeric" value={`${form.deposit ?? ''}`} onChange={(e) => update({ deposit: e.target.value })} placeholder="e.g. 50000" />
        </Field>
        <Field label="Preferred term">
          <SelectInput value={`${form.term ?? '72'}`} onChange={(e) => update({ term: e.target.value })} options={TERMS} />
        </Field>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4">
          <input type="checkbox" checked={!!form.consent} onChange={(e) => update({ consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-red" />
          <span className="text-sm text-graphite-300">
            I consent to Mit-Mak Motors and its finance partners performing a credit assessment and contacting me about this application.
          </span>
        </label>
        {errors.consent && <p className="text-xs text-red">{errors.consent}</p>}
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={!!form.marketing} onChange={(e) => update({ marketing: e.target.checked })} className="mt-0.5 h-4 w-4 accent-red" />
          <span className="text-sm text-graphite-400">Keep me posted on fresh stock, offers and the FOMO Zone.</span>
        </label>
      </div>
    ),
  };

  const individualSteps: StepDef<State>[] = [
    {
      id: 'about',
      title: 'About You',
      description: 'Tell us who you are. Takes about 60 seconds.',
      validate: (f) => required(f, [['firstName', 'First name'], ['lastName', 'Last name'], ['idNumber', 'ID number']]),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title">
            <SelectInput value={`${form.title ?? 'Mr'}`} onChange={(e) => update({ title: e.target.value })} options={opt(TITLES)} />
          </Field>
          <div className="hidden sm:block" />
          <Field label="First name" required error={errors.firstName}>
            <TextInput value={`${form.firstName ?? ''}`} error={errors.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="Thabo" />
          </Field>
          <Field label="Last name" required error={errors.lastName}>
            <TextInput value={`${form.lastName ?? ''}`} error={errors.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Mokoena" />
          </Field>
          <Field label="SA ID / Passport number" required error={errors.idNumber}>
            <TextInput value={`${form.idNumber ?? ''}`} error={errors.idNumber} onChange={(e) => update({ idNumber: e.target.value })} placeholder="13-digit ID" />
          </Field>
          <Field label="Marital status">
            <SelectInput value={`${form.marital ?? 'Single'}`} onChange={(e) => update({ marital: e.target.value })} options={opt(['Single', 'Married', 'Divorced', 'Widowed'])} />
          </Field>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      validate: (f) => emailCheck(f, required(f, [['email', 'Email'], ['mobile', 'Mobile number'], ['city', 'City']])),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" required error={errors.email}>
            <TextInput type="email" value={`${form.email ?? ''}`} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@email.com" />
          </Field>
          <Field label="Mobile" required error={errors.mobile}>
            <TextInput value={`${form.mobile ?? ''}`} error={errors.mobile} onChange={(e) => update({ mobile: e.target.value })} placeholder="082 000 0000" />
          </Field>
          <Field label="Street address" className="sm:col-span-2">
            <TextInput value={`${form.street ?? ''}`} onChange={(e) => update({ street: e.target.value })} placeholder="123 Gerrit Maritz St" />
          </Field>
          <Field label="City" required error={errors.city}>
            <TextInput value={`${form.city ?? ''}`} error={errors.city} onChange={(e) => update({ city: e.target.value })} placeholder="Pretoria" />
          </Field>
          <Field label="Province">
            <SelectInput value={`${form.province ?? 'Gauteng'}`} onChange={(e) => update({ province: e.target.value })} options={opt(PROVINCES)} />
          </Field>
        </div>
      ),
    },
    {
      id: 'income',
      title: 'Employment & Income',
      validate: (f) => required(f, [['grossIncome', 'Gross monthly income'], ['netIncome', 'Net monthly income']]),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Employment status" className="sm:col-span-2">
            <RadioCards
              value={`${form.employment ?? 'Permanent'}`}
              onChange={(v) => update({ employment: v })}
              options={[
                { value: 'Permanent', label: 'Permanently employed' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Self-employed', label: 'Self-employed' },
                { value: 'Pensioner', label: 'Pensioner' },
              ]}
            />
          </Field>
          <Field label="Employer">
            <TextInput value={`${form.employer ?? ''}`} onChange={(e) => update({ employer: e.target.value })} placeholder="Company name" />
          </Field>
          <Field label="Occupation">
            <TextInput value={`${form.occupation ?? ''}`} onChange={(e) => update({ occupation: e.target.value })} placeholder="Your role" />
          </Field>
          <Field label="Gross monthly income (R)" required error={errors.grossIncome}>
            <TextInput type="number" inputMode="numeric" value={`${form.grossIncome ?? ''}`} error={errors.grossIncome} onChange={(e) => update({ grossIncome: e.target.value })} placeholder="45000" />
          </Field>
          <Field label="Net monthly income (R)" required error={errors.netIncome}>
            <TextInput type="number" inputMode="numeric" value={`${form.netIncome ?? ''}`} error={errors.netIncome} onChange={(e) => update({ netIncome: e.target.value })} placeholder="32000" />
          </Field>
        </div>
      ),
    },
    consentStep,
  ];

  const businessSteps: StepDef<State>[] = [
    {
      id: 'business',
      title: 'Business Details',
      validate: (f) => required(f, [['regName', 'Registered name'], ['regNumber', 'Registration number']]),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Registered name" required error={errors.regName}>
            <TextInput value={`${form.regName ?? ''}`} error={errors.regName} onChange={(e) => update({ regName: e.target.value })} placeholder="Acme (Pty) Ltd" />
          </Field>
          <Field label="Trading name">
            <TextInput value={`${form.tradingName ?? ''}`} onChange={(e) => update({ tradingName: e.target.value })} placeholder="Acme" />
          </Field>
          <Field label="Registration number" required error={errors.regNumber}>
            <TextInput value={`${form.regNumber ?? ''}`} error={errors.regNumber} onChange={(e) => update({ regNumber: e.target.value })} placeholder="2020/123456/07" />
          </Field>
          <Field label="VAT number">
            <TextInput value={`${form.vatNumber ?? ''}`} onChange={(e) => update({ vatNumber: e.target.value })} placeholder="Optional" />
          </Field>
          <Field label="Entity type">
            <SelectInput value={`${form.entityType ?? 'Pty Ltd'}`} onChange={(e) => update({ entityType: e.target.value })} options={opt(['Pty Ltd', 'Close Corporation', 'Sole Proprietor', 'Trust', 'Partnership'])} />
          </Field>
          <Field label="Years trading">
            <TextInput type="number" inputMode="numeric" value={`${form.yearsTrading ?? ''}`} onChange={(e) => update({ yearsTrading: e.target.value })} placeholder="5" />
          </Field>
        </div>
      ),
    },
    {
      id: 'person',
      title: 'Contact Person',
      validate: (f) => emailCheck(f, required(f, [['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email'], ['mobile', 'Mobile']])),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" required error={errors.firstName}>
            <TextInput value={`${form.firstName ?? ''}`} error={errors.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="Name" />
          </Field>
          <Field label="Last name" required error={errors.lastName}>
            <TextInput value={`${form.lastName ?? ''}`} error={errors.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Surname" />
          </Field>
          <Field label="Role in business">
            <TextInput value={`${form.role ?? ''}`} onChange={(e) => update({ role: e.target.value })} placeholder="Director / Owner" />
          </Field>
          <div className="hidden sm:block" />
          <Field label="Email" required error={errors.email}>
            <TextInput type="email" value={`${form.email ?? ''}`} error={errors.email} onChange={(e) => update({ email: e.target.value })} placeholder="you@business.co.za" />
          </Field>
          <Field label="Mobile" required error={errors.mobile}>
            <TextInput value={`${form.mobile ?? ''}`} error={errors.mobile} onChange={(e) => update({ mobile: e.target.value })} placeholder="082 000 0000" />
          </Field>
        </div>
      ),
    },
    {
      id: 'financials',
      title: 'Financials',
      validate: (f) => required(f, [['turnover', 'Annual turnover']]),
      render: ({ form, update, errors }) => (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Annual turnover (R)" required error={errors.turnover}>
            <TextInput type="number" inputMode="numeric" value={`${form.turnover ?? ''}`} error={errors.turnover} onChange={(e) => update({ turnover: e.target.value })} placeholder="2500000" />
          </Field>
          <Field label="Net monthly profit (R)">
            <TextInput type="number" inputMode="numeric" value={`${form.profit ?? ''}`} onChange={(e) => update({ profit: e.target.value })} placeholder="120000" />
          </Field>
          <Field label="Number of employees">
            <TextInput type="number" inputMode="numeric" value={`${form.employees ?? ''}`} onChange={(e) => update({ employees: e.target.value })} placeholder="12" />
          </Field>
          <Field label="Number of vehicles to finance">
            <TextInput type="number" inputMode="numeric" value={`${form.fleetSize ?? ''}`} onChange={(e) => update({ fleetSize: e.target.value })} placeholder="1" />
          </Field>
        </div>
      ),
    },
    consentStep,
  ];

  return (
    <MultiStepForm<State>
      steps={variant === 'business' ? businessSteps : individualSteps}
      initial={initial}
      endpoint="/api/finance"
      formType={`finance-${variant}`}
      storageKey={`mm-finance-${variant}`}
      submitLabel="Submit Application"
      successTitle="Application Received"
      successMessage="A finance consultant will call you shortly with your pre-approval. Most applicants hear back within one business day."
    />
  );
}
