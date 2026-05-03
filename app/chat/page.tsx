import ChatWindow from '@/components/ChatWindow';
import { Sparkles, ShieldAlert } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side: Info */}
        <div className="md:w-1/3 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3 w-3" />
              Powered by Gemini
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Election Assistant</h1>
            <p className="text-secondary leading-relaxed">
              Ask any question about the election process. Our AI is trained on official guidelines
              to provide you with accurate, non-partisan information.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-secondary">
              Try asking about:
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'How do I register online?',
                'What ID do I need?',
                'Polling dates in Mumbai',
                'How to find my booth?',
                'What is the voting age?',
              ].map((q, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium border border-transparent hover:border-primary/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex gap-3">
              <ShieldAlert className="h-5 w-5 text-orange-600 shrink-0" />
              <p className="text-xs text-orange-800 leading-relaxed">
                <strong>Disclaimer:</strong> This assistant provides general information. For legal
                or specific electoral issues, always refer to the Election Commission&apos;s
                official website.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="md:w-2/3">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
