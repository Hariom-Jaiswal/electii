import { POST } from '@/app/api/chat/route';
import { NextResponse } from 'next/server';

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

// Mock Env validation
jest.mock('@/lib/env-validation', () => ({
  validateEnv: jest.fn(),
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

  it('returns AI response for valid request', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.text).toBe('Mock AI Response');
  });
});
