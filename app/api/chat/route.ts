import { NextResponse } from 'next/server';
import { model, chatConfig } from '@/lib/gemini';
import { validateEnv } from '@/lib/env-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { GeminiHistoryItem } from '@/lib/types';

interface RequestMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_HISTORY_TURNS = 10;

/**
 * Validates the incoming chat request body.
 * Reduces cognitive complexity of the main POST handler.
 */
function validateRequest(messages: RequestMessage[]) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return 'Invalid request: messages array is required.';
  }
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.content?.trim()) {
    return 'Message content cannot be empty.';
  }
  return null;
}

/**
 * Transforms message history into the format expected by Vertex AI.
 * Handles role mapping and history truncation.
 */
function buildGeminiHistory(messages: RequestMessage[]): GeminiHistoryItem[] {
  const recentMessages = messages.slice(-MAX_HISTORY_TURNS);
  const history: GeminiHistoryItem[] = [];

  for (let i = 0; i < recentMessages.length - 1; i++) {
    const m = recentMessages[i];
    const role = m.role === 'user' ? 'user' : 'model';

    // Vertex AI history must start with a 'user' message
    if (history.length === 0 && role !== 'user') continue;

    history.push({ role, parts: [{ text: m.content.trim() }] });
  }
  return history;
}

/**
 * Persists chat interactions to Firestore for authenticated users.
 */
async function persistChatLog(
  userId: string | undefined,
  userMsg: string,
  aiResp: string,
  ip: string
) {
  if (!userId) return;
  try {
    await addDoc(collection(db, 'chat_logs'), {
      userId,
      userMessage: userMsg,
      aiResponse: aiResp,
      timestamp: serverTimestamp(),
      ip: ip.replace(/\.[0-9]+$/, '.xxx'), // Masked IP
    });
  } catch (e) {
    logger.error('Firestore save failed', { error: e instanceof Error ? e.message : 'Unknown' });
  }
}

/**
 * POST /api/chat
 * Refactored to keep cognitive complexity low (<15).
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { ip });
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    validateEnv();
    const { messages, userId } = await req.json();

    const validationError = validateRequest(messages);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const history = buildGeminiHistory(messages);
    const lastMessage = messages[messages.length - 1];

    logger.info('Vertex AI Request', { historyLength: history.length, ip });

    const chat = model.startChat({ history, generationConfig: chatConfig.generationConfig });
    const result = await chat.sendMessage(lastMessage.content.trim());
    const text =
      (await result.response).candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated.';

    await persistChatLog(userId, lastMessage.content.trim(), text, ip);

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
    logger.error('Chat API failure', {
      error: error instanceof Error ? error.message : 'Unknown',
      ip,
    });
    return NextResponse.json({ error: 'Generation failed.' }, { status: 500 });
  }
}
