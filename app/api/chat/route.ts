import { NextResponse } from 'next/server';
import { getGeminiModel, chatConfig, safetySettings } from '@/lib/gemini';
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

function buildGeminiHistory(messages: RequestMessage[]): GeminiHistoryItem[] {
  const recentMessages = messages.slice(-MAX_HISTORY_TURNS);
  const history: GeminiHistoryItem[] = [];

  for (let i = 0; i < recentMessages.length - 1; i++) {
    const m = recentMessages[i];
    const role = m.role === 'user' ? 'user' : 'model';
    if (history.length === 0 && role !== 'user') continue;
    history.push({ role, parts: [{ text: m.content.trim() }] });
  }
  return history;
}

async function persistChatLog(userId: string | undefined, userMsg: string, aiResp: string, ip: string) {
  if (!userId) return;
  try {
    await addDoc(collection(db, 'chat_logs'), {
      userId,
      userMessage: userMsg,
      aiResponse: aiResp,
      timestamp: serverTimestamp(),
      ip: ip.replace(/\.[0-9]+$/, '.xxx'),
    });
  } catch (e) {
    logger.error('Firestore save failed', { error: e instanceof Error ? e.message : 'Unknown' });
  }
}

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

    logger.info('Gemini AI Request', { historyLength: history.length, ip });

    // Lazy initialize the model to prevent build-time failures
    const model = getGeminiModel();
    const chat = model.startChat({ 
      history, 
      generationConfig: chatConfig,
      safetySettings 
    });

    const result = await chat.sendMessage(lastMessage.content.trim());
    const text = result.response.text();

    await persistChatLog(userId, lastMessage.content.trim(), text, ip);

    return NextResponse.json({ text }, {
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining), 'Cache-Control': 'no-store' }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown';
    logger.error('Chat API failure', { error: message, ip });
    return NextResponse.json({ error: 'Generation failed.' }, { status: 500 });
  }
}
