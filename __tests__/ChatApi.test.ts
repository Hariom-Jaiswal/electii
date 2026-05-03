import { POST } from '@/app/api/chat/route';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {},
  app: {},
  auth: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock the Gemini library
const mockModel = {
  startChat: jest.fn().mockReturnValue({
    sendMessage: jest.fn().mockResolvedValue({
      response: {
        text: () => 'Mock AI Response',
      },
    }),
  }),
};

jest.mock('@/lib/gemini', () => ({
  getGeminiModel: jest.fn(() => mockModel),
  chatConfig: {},
  safetySettings: [],
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

  it('returns 500 on Gemini API failure', async () => {
    mockModel.startChat.mockReturnValueOnce({
      sendMessage: jest.fn().mockRejectedValueOnce(new Error('Internal network failure')),
    });

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
