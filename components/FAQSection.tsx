'use client';

import { FAQ } from '@/lib/mock-data';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const ringClass = isOpen ? 'ring-2 ring-primary/20' : '';

          return (
            <div
              key={faq.id || faq.question}
              className={`glass-card overflow-hidden transition-all ${ringClass}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-secondary transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <div className="h-px bg-border mb-4" />
                  <p className="text-secondary leading-relaxed">{faq.answer}</p>
                  <div className="mt-4 inline-block px-2 py-1 rounded bg-accent text-[10px] font-bold uppercase tracking-wider text-secondary">
                    {faq.category}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
