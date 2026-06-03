// ─────────────────────────────────────────────────────────────
// Vehicle finance math (instalment sale with optional balloon).
// All figures in ZAR. Interest is a nominal annual rate, compounded
// monthly, the standard SA bank quoting convention.
// ─────────────────────────────────────────────────────────────

export interface FinanceInput {
  price: number;
  /** Deposit in Rand */
  deposit: number;
  /** Term in months */
  termMonths: number;
  /** Nominal annual interest rate, e.g. 11.75 */
  interestRate: number;
  /** Balloon / residual as a percentage of the purchase price (0-40) */
  balloonPct: number;
  /** Optional once-off + monthly admin fees */
  initiationFee?: number;
  monthlyFee?: number;
}

export interface FinanceResult {
  monthly: number;
  principal: number;
  balloonAmount: number;
  totalRepayment: number;
  totalInterest: number;
  costOfCredit: number;
}

export const FINANCE_DEFAULTS = {
  interestRate: 11.75, // tracks SA prime, indicative only
  termMonths: 72,
  balloonPct: 0,
  depositPct: 10,
};

export const TERM_OPTIONS = [12, 24, 36, 48, 54, 60, 72, 84];
export const BALLOON_OPTIONS = [0, 10, 15, 20, 25, 30, 35, 40];

export function calculateFinance(input: FinanceInput): FinanceResult {
  const {
    price,
    deposit,
    termMonths,
    interestRate,
    balloonPct,
    initiationFee = 1207.5, // NCA-capped indicative initiation fee
    monthlyFee = 69,
  } = input;

  const balloonAmount = (price * balloonPct) / 100;
  const principal = Math.max(price - deposit + initiationFee, 0);
  const r = interestRate / 100 / 12;
  const n = termMonths;

  let base: number;
  if (r === 0) {
    base = (principal - balloonAmount) / n;
  } else {
    // Present value of the balloon, discounted to today.
    const pvBalloon = balloonAmount / Math.pow(1 + r, n);
    const amortised = principal - pvBalloon;
    base = (amortised * r) / (1 - Math.pow(1 + r, -n));
  }

  const monthly = base + monthlyFee;
  const totalRepayment = monthly * n + balloonAmount + deposit;
  const totalInterest = totalRepayment - price - initiationFee - monthlyFee * n;
  const costOfCredit = totalRepayment - price;

  return {
    monthly: Math.round(monthly),
    principal: Math.round(principal),
    balloonAmount: Math.round(balloonAmount),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(Math.max(totalInterest, 0)),
    costOfCredit: Math.round(costOfCredit),
  };
}

/** Quick estimate used on cards / hero, 10% deposit, 72mo, no balloon. */
export function estimateMonthly(price: number): number {
  return calculateFinance({
    price,
    deposit: price * (FINANCE_DEFAULTS.depositPct / 100),
    termMonths: FINANCE_DEFAULTS.termMonths,
    interestRate: FINANCE_DEFAULTS.interestRate,
    balloonPct: 0,
  }).monthly;
}
