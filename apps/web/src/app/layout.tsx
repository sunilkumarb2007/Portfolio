import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
import { PUBLIC_ENV } from '@/lib/env';
import { profile } from '@/content/profile';
import { PageTracker } from '@/components/analytics/PageTracker';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_ENV.siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.pitch,
  applicationName: PUBLIC_ENV.siteName,
  authors: [{ name: profile.name }],
  keywords: [
    'Sunil Kumar B',
    'Sunilkumarb2007',
    'full-stack developer',
    'engineering student',
    'React',
    'Node.js',
    'Python',
    'Flask',
    'Go',
    'AWS',
    'Three.js',
    'Next.js',
    'portfolio',
  ],
  openGraph: {
    type: 'website',
    title: `${profile.name} — ${profile.role}`,
    description: profile.pitch,
    siteName: PUBLIC_ENV.siteName,
    url: PUBLIC_ENV.siteUrl,
  },
  twitter: { card: 'summary_large_image', title: profile.name, description: profile.pitch },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#06070b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        {children}
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>
      </body>
    </html>
  );
}
