'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateFinance, FINANCE_DEFAULTS, TERM_OPTIONS, BALLOON_OPTIONS } from '@/lib/finance';
import { formatPrice, cn } from '@/lib/utils';

export function FinanceCalculator({
  price,
  className,
  compact = false,
  vehicleSlug,
  editablePrice = false,
}: {
  price: number;
  className?: string;
  compact?: boolean;
  vehicleSlug?: string;
  editablePrice?: boolean;
}) {
  const [carPrice, setCarPrice] = useState(price);
  const [depositPct, setDepositPct] = useState(FINANCE_DEFAULTS.depositPct);
  const [termMonths, setTermMonths] = useState(FINANCE_DEFAULTS.termMonths);
  const [interestRate, setInterestRate] = useState(FINANCE_DEFAULTS.interestRate);
  const [balloonPct, setBalloonPct] = useState(FINANCE_DEFAULTS.balloonPct);

  const deposit = Math.round((carPrice * depositPct) / 100);
  const result = calculateFinance({ price: carPrice, deposit, termMonths, interestRate, balloonPct });

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-ink-900/60 p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="font-display text-sm uppercase tracking-wide text-white">Payment Calculator</p>
        <span className="font-display text-[10px] uppercase tracking-widest text-graphite-500">Estimate</span>
      </div>

      <div className="mt-4 rounded-xl bg-red/10 p-4 text-center">
        <p className="text-[11px] uppercase tracking-widest text-graphite-300">Estimated monthly</p>
        <p className="font-anton text-4xl leading-none text-red red-glow-text">{formatPrice(result.monthly)}</p>
        <p className="mt-1 text-[11px] text-graphite-400">over {termMonths} months</p>
      </div>

      <div className="mt-5 space-y-5">
        {editablePrice && (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-graphite-300">Vehicle price</span>
              <span className="text-white">{formatPrice(carPrice)}</span>
            </div>
            <input
              type="number"
              inputMode="numeric"
              value={carPrice}
              onChange={(e) => setCarPrice(Math.max(0, Number(e.target.value)))}
              className="h-10 w-full rounded-lg border border-white/15 bg-ink-900 px-3 text-sm text-white outline-none focus:border-red"
              aria-label="Vehicle price"
            />
          </div>
        )}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-graphite-300">Deposit</span>
            <span className="text-white">{formatPrice(deposit)} · {depositPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={depositPct}
            onChange={(e) => setDepositPct(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-red"
            aria-label="Deposit percentage"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-graphite-300">Interest rate</span>
            <span className="text-white">{interestRate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={7}
            max={18}
            step={0.25}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-red"
            aria-label="Interest rate"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-graphite-300">Term</span>
            <select
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="h-10 w-full cursor-pointer rounded-lg border border-white/15 bg-ink-900 px-3 text-sm text-white outline-none focus:border-red"
            >
              {TERM_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-ink-900">
                  {t} months
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-graphite-300">Balloon</span>
            <select
              value={balloonPct}
              onChange={(e) => setBalloonPct(Number(e.target.value))}
              className="h-10 w-full cursor-pointer rounded-lg border border-white/15 bg-ink-900 px-3 text-sm text-white outline-none focus:border-red"
            >
              {BALLOON_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-ink-900">
                  {b}%
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {!compact && (
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
          <div>
            <dt className="text-xs text-graphite-400">Balloon amount</dt>
            <dd className="text-white">{formatPrice(result.balloonAmount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-graphite-400">Cost of credit</dt>
            <dd className="text-white">{formatPrice(result.costOfCredit)}</dd>
          </div>
          <div>
            <dt className="text-xs text-graphite-400">Total repayment</dt>
            <dd className="text-white">{formatPrice(result.totalRepayment)}</dd>
          </div>
          <div>
            <dt className="text-xs text-graphite-400">On the road</dt>
            <dd className="text-white">{formatPrice(carPrice)}</dd>
          </div>
        </dl>
      )}

      <Link
        href={vehicleSlug ? `/finance?vehicle=${vehicleSlug}` : '/finance'}
        data-cursor="hover"
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-red font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow-sm"
      >
        Apply for Finance
      </Link>
      <p className="mt-3 text-[10px] leading-relaxed text-graphite-600">
        Estimate only, for illustration. Subject to credit approval &amp; bank rates. Includes indicative
        initiation &amp; monthly fees. T&amp;Cs apply.
      </p>
    </div>
  );
}
