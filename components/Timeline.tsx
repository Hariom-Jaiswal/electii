'use client';

import { ElectionPhase } from '@/lib/mock-data';
import * as Icons from 'lucide-react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function Timeline({ phases }: { phases: ElectionPhase[] }) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {phases.map((phase) => {
        // @ts-expect-error: Dynamic icon access from lucide-react
        const IconComponent = Icons[phase.icon] || Icons.Calendar;

        const isCompleted = phase.status === 'completed';
        const isActive = phase.status === 'active';

        return (
          <div
            key={phase.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            {/* Dot */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-primary text-white animate-pulse'
                    : 'bg-accent text-secondary'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isActive ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>

            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 transition-all hover:ring-2 hover:ring-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent
                    className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-secondary'}`}
                  />
                  <time className="font-mono text-xs font-bold text-secondary">
                    {phase.startDate} — {phase.endDate}
                  </time>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-green-500/10 text-green-600'
                      : isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent text-secondary'
                  }`}
                >
                  {phase.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-foreground mb-1">{phase.title}</h4>
              <p className="text-sm text-secondary leading-relaxed">{phase.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
