import Timeline from '@/components/Timeline';
import { ELECTION_DATA } from '@/lib/mock-data';
import { Calendar, Info } from 'lucide-react';

export default function TimelinePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
          <Calendar className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Election Schedule 2024
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Track the critical phases of the {ELECTION_DATA.country} {ELECTION_DATA.type}. Stay
          informed about deadlines and key dates.
        </p>
      </div>

      <div className="mb-12 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
        <Info className="h-6 w-6 text-primary shrink-0" />
        <div>
          <h3 className="font-bold text-primary mb-1">
            Current Status:{' '}
            {ELECTION_DATA.phases.find((p) => p.status === 'active')?.title || 'Active'}
          </h3>
          <p className="text-sm text-secondary leading-relaxed">
            The election is currently in the active phase. Multiple states are undergoing polling
            and campaigning. Ensure you check your specific phase dates based on your constituency.
          </p>
        </div>
      </div>

      <Timeline phases={ELECTION_DATA.phases} />

      <div className="mt-20 text-center">
        <p className="text-secondary text-sm mb-6">Want more details about a specific phase?</p>
        <button className="btn-primary">Ask the Assistant</button>
      </div>
    </div>
  );
}
