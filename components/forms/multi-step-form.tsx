'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepCtx<T> {
  form: T;
  update: (patch: Partial<T>) => void;
  errors: Record<string, string>;
}

export interface StepDef<T> {
  id: string;
  title: string;
  description?: string;
  render: (ctx: StepCtx<T>) => ReactNode;
  validate?: (form: T) => Record<string, string>;
}

function jsonReplacer(_key: string, value: unknown) {
  if (typeof File !== 'undefined' && value instanceof File) {
    return { name: value.name, size: value.size, type: value.type };
  }
  return value;
}

export function MultiStepForm<T extends Record<string, unknown>>({
  steps,
  initial,
  endpoint,
  formType,
  storageKey,
  submitLabel = 'Submit',
  successTitle = 'All done',
  successMessage = 'We’ve received your details and a consultant will be in touch shortly.',
}: {
  steps: StepDef<T>[];
  initial: T;
  endpoint: string;
  formType: string;
  storageKey?: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  function update(patch: Partial<T>) {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next, jsonReplacer));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
    setErrors({});
  }

  function validateCurrent() {
    const v = steps[step].validate?.(form) ?? {};
    setErrors(v);
    return Object.keys(v).length === 0;
  }

  function next() {
    if (!validateCurrent()) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    if (!validateCurrent()) return;
    setStatus('submitting');
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: formType, data: form }, jsonReplacer),
      });
      setStatus('done');
      if (storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* ignore */
        }
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-red/30 bg-ink-850 p-10 text-center"
      >
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red shadow-glow">
          <Check className="h-8 w-8 text-white" />
        </span>
        <h3 className="mt-6 font-anton text-3xl uppercase tracking-tight text-white">{successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-graphite-300">{successMessage}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/showroom" className="inline-flex h-12 items-center rounded-full bg-red px-6 font-display text-xs uppercase tracking-wide text-white hover:shadow-glow-sm">
            Browse the Showroom
          </Link>
          <Link href="/" className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 font-display text-xs uppercase tracking-wide text-white hover:border-white/40">
            Back Home
          </Link>
        </div>
      </motion.div>
    );
  }

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div>
      {/* Progress */}
      <div className="mb-9">
        <div className="hidden items-center sm:flex">
          {steps.map((s, i) => (
            <div key={s.id} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm transition-colors',
                    i < step
                      ? 'border-red bg-red text-white'
                      : i === step
                        ? 'border-red text-red'
                        : 'border-white/20 text-graphite-500',
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn('font-display text-xs uppercase tracking-wide', i <= step ? 'text-white' : 'text-graphite-500')}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-3 h-px flex-1 bg-white/10">
                  <div className={cn('h-full bg-red transition-all duration-500', i < step ? 'w-full' : 'w-0')} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="sm:hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-display uppercase tracking-wide text-white">{current.title}</span>
            <span className="text-graphite-400">Step {step + 1} of {steps.length}</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-red" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Step body */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-2xl uppercase tracking-tight text-white">{current.title}</h2>
            {current.description && <p className="mt-1.5 text-sm text-graphite-400">{current.description}</p>}
            <div className="mt-6">{current.render({ form, update, errors })}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            onClick={back}
            data-cursor="hover"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 font-display text-xs uppercase tracking-wide text-graphite-200 transition-colors hover:border-white/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span />
        )}

        {isLast ? (
          <button
            onClick={submit}
            disabled={status === 'submitting'}
            data-cursor="hover"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
          >
            {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitLabel}
          </button>
        ) : (
          <button
            onClick={next}
            data-cursor="hover"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-red px-7 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {status === 'error' && (
        <p className="mt-4 text-center text-sm text-red">Something went wrong submitting. Please try again or call us.</p>
      )}
    </div>
  );
}
