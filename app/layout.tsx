import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'MiroFish - Simulate the Future',
  description: 'Upload any document — AI agents debate, evolve, predict.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={jetbrainsMono.variable}>
      <body className={cn(
        'min-h-screen font-mono antialiased'
      )}>
        {children}
      </body>
    </html>
  );
}
