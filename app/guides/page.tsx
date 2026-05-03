import GuideCard from '@/components/GuideCard';
import { ELECTION_DATA } from '@/lib/mock-data';
import { BookOpen, Search } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
            <BookOpen className="h-4 w-4" />
            Voter Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Voting Knowledge Hub
          </h1>
          <p className="text-xl text-secondary">
            Everything from first-time registration to finding your polling station. Simplified
            guides for every citizen.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search guides..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-accent border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ELECTION_DATA.guides.map((guide) => (
          <GuideCard key={guide.id} {...guide} />
        ))}
        {/* Placeholder for more guides */}
        <div className="glass-card p-8 border-dashed flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-bold mb-1">More Guides Coming Soon</h3>
          <p className="text-xs text-secondary">We&apos;re constantly updating our library.</p>
        </div>
      </div>

      <section className="mt-20 glass-card bg-accent/30 p-12 rounded-[2rem]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Need personalized help?</h2>
            <p className="text-secondary leading-relaxed mb-8">
              If you can&apos;t find what you&apos;re looking for in our guides, our AI assistant is
              ready to help you with specific queries about your situation.
            </p>
            <button className="btn-primary">Chat with ElectoAI</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'First-time Voters',
              'Overseas Voters',
              'Service Voters',
              'Senior Citizens',
              'PWD Voters',
              'Transgender Voters',
            ].map((tag, i) => (
              <div
                key={i}
                className="bg-background p-4 rounded-xl text-center text-sm font-semibold shadow-sm border"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
