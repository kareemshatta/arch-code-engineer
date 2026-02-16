import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { localeDirection, Locale } from '@/i18n.config';
import './globals.css';

// Display font - elegant serif for headings
const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Body font - clean sans-serif
const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// Monospace font for code/technical
const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Arch Code Engineer | Premium Architectural Design',
    template: '%s | Arch Code Engineer',
  },
  description: 'Award-winning architectural design studio creating innovative spaces that inspire and endure.',
  keywords: ['architecture', 'design', 'engineering', 'urban planning', 'sustainable design'],
  authors: [{ name: 'Arch Code Engineer' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Arch Code Engineer',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale() as Locale;
  const messages = await getMessages();
  const direction = localeDirection[locale];

  return (
    <html 
      lang={locale} 
      dir={direction}
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="font-body antialiased bg-white text-stone-900">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
