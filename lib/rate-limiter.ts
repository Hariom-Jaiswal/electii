/**
 * In-memory IP-based rate limiter for API routes.
 * Limits each IP to MAX_REQUESTS per WINDOW_MS.
 */

const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — resets on cold start (acceptable for Cloud Run)
const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + WINDOW_MS;
    store.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

// Expose constants for testing
export { MAX_REQUESTS, WINDOW_MS };
