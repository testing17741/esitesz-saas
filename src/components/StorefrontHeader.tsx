'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ArrowRight } from 'lucide-react';

interface StorefrontHeaderProps {
  business: {
    name: string;
    slug: string;
    logoUrl?: string | null;
    phone: string;
    ctaText?: string | null;
  };
}

export function StorefrontHeader({ business }: StorefrontHeaderProps) {
  const pathname = usePathname();
  const basePath = `/biz/${business.slug}`;

  const navLinks = [
    { label: 'Overview', href: basePath },
    { label: 'About', href: `${basePath}/about` },
    { label: 'Services', href: `${basePath}/services` },
    { label: 'Contact', href: `${basePath}/contact` },
  ];

  return (
    <>
      {/* Top Verified Agency Banner */}
      <div className="bg-slate-900 text-white text-center py-2 px-4 text-xs font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="opacity-80">Verified Local Business Listing</span>
        <span>•</span>
        <span className="text-blue-400 font-semibold">Powered by esitesz</span>
      </div>

      {/* Main Header with Multi-Page Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href={basePath} className="flex items-center gap-3">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  className="h-12 w-auto max-w-[160px] object-contain rounded"
                />
              ) : (
                <div className="h-11 px-4 rounded-xl border-2 border-blue-600 bg-blue-50/60 flex items-center justify-center">
                  <span className="text-blue-700 font-black text-sm uppercase tracking-wider">
                    {business.name}
                  </span>
                </div>
              )}
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition pb-1 border-b-2 ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Calling & CTA Button */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Direct Line</span>
                <a
                  href={`tel:${business.phone}`}
                  className="text-sm font-black text-slate-800 hover:text-blue-600 transition"
                >
                  {business.phone}
                </a>
              </div>
              <Link
                href={`${basePath}/contact`}
                className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm transition"
              >
                {business.ctaText || 'Get Quote'}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
