import Link from 'next/link';
import { ELECTION_DATA } from '@/lib/mock-data';
import GuideCard from '@/components/GuideCard';
import FAQSection from '@/components/FAQSection';
import { Bot, Calendar, ArrowRight, Sparkles, ShieldCheck, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Empowering Voters with AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
            Navigate Your Vote with <span className="text-primary">Confidence.</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Your personal AI assistant for everything election-related. From registration deadlines
            to polling day procedures, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat" className="btn-primary flex items-center gap-2 w-full sm:w-auto">
              Ask Assistant
              <Bot className="h-5 w-5" />
            </Link>
            <Link
              href="/timeline"
              className="btn-secondary flex items-center gap-2 w-full sm:w-auto"
            >
              View Timeline
              <Calendar className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Localized Info</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Get data specific to your constituency and state, ensuring you have the right
              information at the right time.
            </p>
          </div>
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Neutral & Factual</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Our AI is strictly grounded in official election commission data, providing unbiased
              and verified instructions.
            </p>
          </div>
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Answers</h3>
            <p className="text-secondary text-sm leading-relaxed">
              No more digging through complex government PDFs. Just ask, and get clear, concise
              steps instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Preview */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Step-by-Step Guides</h2>
            <p className="text-secondary">
              Everything you need to know about the voting lifecycle.
            </p>
          </div>
          <Link href="/guides" className="hidden sm:flex items-center gap-2 text-primary font-bold">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ELECTION_DATA.guides.map((guide) => (
            <GuideCard key={guide.id} {...guide} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-4xl">
        <FAQSection faqs={ELECTION_DATA.faqs} />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="glass-card bg-primary text-primary-foreground p-12 rounded-[2rem] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <h2 className="text-4xl font-bold mb-6">Ready to cast your vote?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10 text-lg">
            Join thousands of informed citizens using ElectoAI to navigate the democratic process
            with ease.
          </p>
          <Link
            href="/chat"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-primary transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
