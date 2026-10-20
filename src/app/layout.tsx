import type { Metadata } from 'next';
import './globals.css';
import { PlatformShell } from '@/components/PlatformShell';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'esitesz — Local Business Digital Engine & Instant Lead Sync SaaS',
  description:
    'Turn your local business into a high-converting digital storefront with instant WhatsApp inquiries, Google Maps GEO optimization, and automated lead sheet sync. Developed by esitesz.',
  keywords: 'business landing page, local seo, aeo optimization, whatsapp leads, esitesz, business builder',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'esitesz — Local Business Digital Engine',
    description: 'Create high-converting landing pages with instant lead capture and AEO/GEO optimization.',
    siteName: 'esitesz',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'esitesz — Local Business Digital Engine',
    description: 'Instant lead sync, WhatsApp automation, and local SEO for businesses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <PlatformShell>{children}</PlatformShell>
        <CookieBanner />
      </body>
    </html>
  );
}
