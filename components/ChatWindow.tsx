'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm ElectoAI, your election process guide. Ask me anything about voter registration, polling day procedures, or your rights as a citizen.",
  timestamp: new Date(),
};

export default function ChatWindow() {
  // --- All state declarations at the top (Code Quality) ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize client-side to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  // useCallback prevents re-creating this function on every render (Efficiency)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    // Use crypto.randomUUID for proper unique IDs (Code Quality)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await response.json()) as { text: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to get AI response');
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error. ${error instanceof Error ? error.message : 'Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div
      className="flex flex-col h-[600px] glass-card rounded-2xl overflow-hidden"
      role="region"
      aria-label="ElectoAI Chat Assistant"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
            aria-hidden="true"
          >
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">ElectoAI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      {/* Messages — role="log" for screen readers (Accessibility) */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-accent/20"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        aria-relevant="additions"
      >
        {isMounted &&
          messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  m.role === 'user'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
                aria-hidden="true"
              >
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-card text-card-foreground border rounded-tl-none'
                }`}
              >
                <p>{m.content}</p>
                <div
                  className={`text-[10px] mt-2 opacity-60 ${m.role === 'user' ? 'text-right' : ''}`}
                  aria-label={`Sent at ${m.timestamp.toLocaleTimeString()}`}
                >
                  {m.timestamp.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="flex gap-4" aria-label="ElectoAI is typing" role="status">
            <div
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              aria-hidden="true"
            >
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="relative flex items-center">
          <label htmlFor="chat-input" className="sr-only">
            Ask ElectoAI a question about elections
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about registration, deadlines, or polling..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-accent/50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            aria-label="Type your election question"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-[10px] text-center text-secondary mt-3 uppercase font-bold tracking-widest opacity-50">
          AI generated response • Always verify with official sources
        </p>
      </div>
    </div>
  );
}
