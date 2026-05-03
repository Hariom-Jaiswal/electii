'use client';

import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GuideCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function GuideCard({ id, title, description, icon }: GuideCardProps) {
  // @ts-expect-error: Dynamic icon access from lucide-react
  const IconComponent = Icons[icon] || Icons.HelpCircle;

  return (
    <Link href={`/guides/${id}`} className="group block">
      <div className="glass-card p-6 h-full transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="mb-4 inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <IconComponent className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-secondary text-sm leading-relaxed mb-6">{description}</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
