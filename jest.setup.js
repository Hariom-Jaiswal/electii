import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfill Response.json — not available in jsdom's fetch implementation
if (typeof Response !== 'undefined' && !Response.json) {
  Response.json = function (data, init) {
    const body = JSON.stringify(data);
    const headers = new Headers(init?.headers);
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    return new Response(body, { ...init, headers });
  };
}

// Polyfill NextResponse.json — Next.js uses its own Response wrapper
// We override it to return a standard Response so .json() works in tests
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: (data, init) => {
        const body = JSON.stringify(data);
        const status = init?.status ?? 200;
        const headers = new Headers(init?.headers ?? {});
        headers.set('content-type', 'application/json');
        return new Response(body, { status, headers });
      },
    },
  };
});
