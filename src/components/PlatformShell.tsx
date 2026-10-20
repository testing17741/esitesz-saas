'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStorefront = pathname?.startsWith('/biz/');

  // If this is a business storefront page, render it completely standalone
  // without the parent SaaS platform Navbar and Footer on top of it.
  if (isStorefront) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
