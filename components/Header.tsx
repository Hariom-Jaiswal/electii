'use client';

import Link from 'next/link';
import { Vote, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Vote className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Electo<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/chat"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            AI Assistant
          </Link>
          <Link
            href="/timeline"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Guides
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border">
            <span className="text-xs font-semibold text-secondary">INDIA</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <button
            className="md:hidden p-2 text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-6 space-y-4 shadow-xl">
          <Link
            href="/chat"
            className="block text-lg font-medium text-secondary"
            onClick={() => setIsMenuOpen(false)}
          >
            AI Assistant
          </Link>
          <Link
            href="/timeline"
            className="block text-lg font-medium text-secondary"
            onClick={() => setIsMenuOpen(false)}
          >
            Timeline
          </Link>
          <Link
            href="/guides"
            className="block text-lg font-medium text-secondary"
            onClick={() => setIsMenuOpen(false)}
          >
            Guides
          </Link>
        </div>
      )}
    </header>
  );
}
