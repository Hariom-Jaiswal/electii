import { NextResponse } from 'next/server';
import { model, chatConfig } from '@/lib/gemini';
import { validateEnv } from '@/lib/env-validation';
import { checkRateLimit } from '@/lib/rate-limiter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Max history turns to keep token usage efficient
const MAX_HISTORY_TURNS = 10;

export async function POST(req: Request) {
  // --- Rate Limiting ---
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    validateEnv();

    const body = await req.json();
    const { messages } = body as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required.' },
        { status: 400 }
      );
    }

    // Validate content is not empty
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 });
    }

    // Truncate history to last N turns for token efficiency
    const recentMessages = messages.slice(-MAX_HISTORY_TURNS);

    // Build Gemini history — must start with 'user', alternate roles
    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (let i = 0; i < recentMessages.length - 1; i++) {
      const m = recentMessages[i];
      const role = m.role === 'user' ? 'user' : 'model';
      if (history.length === 0 && role !== 'user') continue;
      history.push({ role, parts: [{ text: m.content.trim() }] });
    }

    const chat = model.startChat({ history, ...chatConfig });
    const result = await chat.sendMessage(lastMessage.content.trim());
    const text = result.response.text();

    return NextResponse.json(
      { text },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    // Sanitize error — don't expose internal details to the client
    const isKnownError = error instanceof Error && error.message.includes('GEMINI_API_KEY');
    const message = isKnownError
      ? 'API configuration error. Please contact support.'
      : 'Failed to generate a response. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
