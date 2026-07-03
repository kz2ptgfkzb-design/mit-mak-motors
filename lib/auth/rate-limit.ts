// Lightweight in-memory sliding-window rate limiter for the auth endpoints.
// Per-process (best-effort on serverless, where instances don't share state),
// but it meaningfully throttles online brute-force from a single source.

const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (v.every((t: number) => now - t >= windowMs)) hits.delete(k);
    });
  }
  return true;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
