import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ElectoAI | Your Personal Election Assistant',
  description:
    'Understand the election process, timelines, and voting steps with AI-driven guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-12 bg-accent/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-secondary font-medium">
              © 2024 ElectoAI. Built for informed citizenship.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
