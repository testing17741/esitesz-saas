import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import { StickyMobileBar } from '@/components/StickyMobileBar';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { slug: params.slug } });
  if (!business) return { title: 'Not Found' };
  return {
    title: `About ${business.name} | ${business.category} in ${business.city}`,
    description: `Learn more about ${business.name}, our background, services, and commitment to customers across ${business.city}.`,
  };
}

export default async function BusinessAboutPage({ params }: PageProps) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
  });

  if (!business || business.status !== 'APPROVED') {
    notFound();
  }

  const cleanWa = business.whatsapp.replace(/[^0-9]/g, '');
  const waNumber = cleanWa.startsWith('91') ? cleanWa : `91${cleanWa}`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(business.whatsappMessage || '')}`;

  return (
    <div className="bg-slate-50 text-slate-800 pb-24 md:pb-0 min-h-screen">
      <StorefrontHeader business={business} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <div className="space-y-3">
          <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
            About Our Business
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {business.headline || `Welcome to ${business.name}`}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {business.tagline || `Serving customers with reliable ${business.category} in ${business.city}.`}
          </p>
        </div>

        {/* Story / About card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900">Our Story &amp; Commitment</h2>
            <p>
              {business.description ||
                `${business.name} is a premier provider of ${business.category} based in ${business.city}, ${business.state}. We pride ourselves on transparent communication, reliable execution, and exceptional customer satisfaction.`}
            </p>
            <p>
              Whether you need urgent assistance, a quotation for a major requirement, or expert advice, our dedicated team is always ready to support you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Registered Location</span>
                <span>{business.address}, {business.city}, {business.state} — {business.pincode}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Operating Hours</span>
                <span>{business.openingHours || 'Monday to Saturday: 9:00 AM - 8:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Have a Project or Requirement?</h3>
            <p className="text-xs text-slate-400">Reach out directly on WhatsApp or give us a call.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link
              href={`/biz/${business.slug}/contact`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <StickyMobileBar
        phone={business.phone}
        whatsapp={business.whatsapp}
        whatsappMessage={business.whatsappMessage || ''}
      />
    </div>
  );
}
