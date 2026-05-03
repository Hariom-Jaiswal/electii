import { checkRateLimit, MAX_REQUESTS, WINDOW_MS } from '@/lib/rate-limiter';

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Reset module to clear the in-memory store between tests
    jest.resetModules();
  });

  it('allows the first request from an IP', () => {
    const result = checkRateLimit('1.2.3.4');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_REQUESTS - 1);
  });

  it('allows requests up to the max limit', () => {
    const ip = '10.0.0.1';
    let lastResult = checkRateLimit(ip);
    for (let i = 1; i < MAX_REQUESTS; i++) {
      lastResult = checkRateLimit(ip);
    }
    expect(lastResult.allowed).toBe(true);
    expect(lastResult.remaining).toBe(0);
  });

  it('blocks the request that exceeds the max limit', () => {
    const ip = '10.0.0.2';
    for (let i = 0; i < MAX_REQUESTS; i++) {
      checkRateLimit(ip);
    }
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('treats different IPs independently', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';

    // Exhaust ip1
    for (let i = 0; i < MAX_REQUESTS; i++) {
      checkRateLimit(ip1);
    }

    // ip2 should still be allowed
    const result = checkRateLimit(ip2);
    expect(result.allowed).toBe(true);
  });

  it('resets the window after WINDOW_MS has elapsed', () => {
    jest.useFakeTimers();
    const ip = '172.16.0.1';

    // Exhaust the limit
    for (let i = 0; i < MAX_REQUESTS; i++) {
      checkRateLimit(ip);
    }
    expect(checkRateLimit(ip).allowed).toBe(false);

    // Advance time past the window
    jest.advanceTimersByTime(WINDOW_MS + 1);
    expect(checkRateLimit(ip).allowed).toBe(true);
    jest.useRealTimers();
  });

  it('exports MAX_REQUESTS and WINDOW_MS as positive numbers', () => {
    expect(MAX_REQUESTS).toBeGreaterThan(0);
    expect(WINDOW_MS).toBeGreaterThan(0);
  });
});
