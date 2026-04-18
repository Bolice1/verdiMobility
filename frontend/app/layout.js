import './globals.css';

import { Inter, Manrope } from 'next/font/google';

import { Providers } from '@/components/layout/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'verdiMobility Platform',
  description: 'Premium logistics platform UI built with Next.js, Tailwind, Zustand, and Framer Motion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
