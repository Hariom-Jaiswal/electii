import { POST } from '@/app/api/chat/route';

// Mock the Gemini library
jest.mock('@/lib/gemini', () => ({
  model: {
    startChat: jest.fn().mockReturnValue({
      sendMessage: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mock AI Response',
        },
      }),
    }),
  },
  chatConfig: {},
}));

// Mock env validation
jest.mock('@/lib/env-validation', () => ({
  validateEnv: jest.fn(),
}));

// Mock rate limiter — allow all by default
jest.mock('@/lib/rate-limiter', () => ({
  checkRateLimit: jest
    .fn()
    .mockReturnValue({ allowed: true, remaining: 9, resetAt: Date.now() + 60000 }),
}));

describe('Chat API Route', () => {
  it('returns 400 if messages are missing', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('messages array is required');
  });

  it('returns 400 if messages is an empty array', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('messages array is required');
  });

  it('returns 400 if the last message content is empty', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: '   ' }] }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('cannot be empty');
  });

  it('returns AI response for a valid single-message request', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'How do I register to vote?' }],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.text).toBe('Mock AI Response');
  });

  it('returns AI response and correctly skips initial assistant message in history', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'assistant', content: 'Welcome!' }, // should be skipped
          { role: 'user', content: 'What is NOTA?' },
        ],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.text).toBe('Mock AI Response');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    const { checkRateLimit } = jest.requireMock('@/lib/rate-limiter') as {
      checkRateLimit: jest.Mock;
    };
    checkRateLimit.mockReturnValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 30000,
    });

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });
    const response = await POST(req);
    expect(response.status).toBe(429);
  });

  it('returns 500 on Gemini API failure with a sanitized message', async () => {
    const { model } = jest.requireMock('@/lib/gemini') as {
      model: { startChat: jest.Mock };
    };
    (model.startChat as jest.Mock).mockReturnValueOnce({
      sendMessage: jest.fn().mockRejectedValueOnce(new Error('Internal network failure')),
    });

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(500);
    // Should NOT expose raw error details to client
    expect(data.error).not.toContain('Internal network failure');
  });
});
