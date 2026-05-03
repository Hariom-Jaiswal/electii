import { NextResponse } from 'next/server';
import { model, chatConfig } from '@/lib/gemini';
import { validateEnv } from '@/lib/env-validation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
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

    // Filter messages to prepare history
    // Gemini history must alternate between user and model, and START with user.
    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (let i = 0; i < messages.length - 1; i++) {
      const m = messages[i];
      const role = m.role === 'user' ? 'user' : 'model';

      // Skip until we find the first user message (skip initial assistant welcome)
      if (history.length === 0 && role !== 'user') continue;

      history.push({
        role: role,
        parts: [{ text: m.content }],
      });
    }

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
      ...chatConfig,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate response.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
