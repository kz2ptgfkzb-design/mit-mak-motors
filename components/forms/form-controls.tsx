'use client';

import { useRef, type ReactNode } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputBase =
  'h-12 w-full rounded-xl border bg-ink-900 px-4 text-sm text-white outline-none transition-colors placeholder:text-graphite-600';

export function Field({
  label,
  error,
  required,
  hint,
  children,
  className,
}: {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-2 flex items-center gap-1 font-display text-[11px] uppercase tracking-[0.16em] text-graphite-300">
          {label}
          {required && <span className="text-red">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-graphite-600">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-red">{error}</span>}
    </label>
  );
}

export function TextInput({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className={cn(inputBase, error ? 'border-red' : 'border-white/15 focus:border-red', className)}
    />
  );
}

export function TextArea({
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      {...props}
      className={cn('min-h-28 w-full rounded-xl border bg-ink-900 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-graphite-600', error ? 'border-red' : 'border-white/15 focus:border-red', className)}
    />
  );
}

export function SelectInput({
  error,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string; options: { value: string; label: string }[] }) {
  return (
    <select
      {...props}
      className={cn(inputBase, 'cursor-pointer appearance-none', error ? 'border-red' : 'border-white/15 focus:border-red', className)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-ink-900">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function RadioCards({
  value,
  onChange,
  options,
  columns = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; description?: string }[];
  columns?: number;
}) {
  return (
    <div className={cn('grid gap-3', columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            data-cursor="hover"
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              active ? 'border-red bg-red/10' : 'border-white/15 hover:border-white/40',
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded-full border', active ? 'border-red' : 'border-white/30')}>
                {active && <span className="h-2 w-2 rounded-full bg-red" />}
              </span>
              <span className="font-display text-sm uppercase tracking-tight text-white">{o.label}</span>
            </span>
            {o.description && <span className="mt-1.5 block pl-6 text-xs text-graphite-400">{o.description}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function FileDrop({
  files,
  onChange,
  accept = 'image/*',
  max = 12,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function add(list: FileList | null) {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, max);
    onChange(next);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        data-cursor="hover"
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-ink-900 py-8 text-center transition-colors hover:border-red"
      >
        <UploadCloud className="h-7 w-7 text-graphite-400" />
        <span className="font-display text-sm uppercase tracking-wide text-white">Upload photos</span>
        <span className="text-xs text-graphite-500">Up to {max} images · JPG / PNG</span>
      </button>
      <input ref={ref} type="file" accept={accept} multiple className="hidden" onChange={(e) => add(e.target.files)} />
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {files.map((file, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                aria-label="Remove image"
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
