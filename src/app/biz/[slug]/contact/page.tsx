import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import { StickyMobileBar } from '@/components/StickyMobileBar';
import { BusinessInquiryForm } from '@/components/BusinessInquiryForm';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { slug: params.slug } });
  if (!business) return { title: 'Not Found' };
  return {
    title: `Contact ${business.name} | Phone, Address & Inquiries in ${business.city}`,
    description: `Contact ${business.name} directly. Phone: ${business.phone}, WhatsApp: ${business.whatsapp}. Location: ${business.address}, ${business.city}.`,
  };
}

export default async function BusinessContactPage({ params }: PageProps) {
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <div className="space-y-3 text-center">
          <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
            Direct Contact &amp; Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch with {business.name}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Reach out directly for quotations, on-demand support, or visit us in {business.city}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Contact Details & Map Card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Business Information
              </h2>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Physical Address</span>
                    <p className="text-slate-600 mt-0.5">
                      {business.address}, {business.city}, {business.state} — {business.pincode}, {business.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Direct Phone Line</span>
                    <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline font-mono text-sm block mt-0.5">
                      {business.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">WhatsApp Support</span>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      Chat on WhatsApp (+{waNumber})
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Operating Hours</span>
                    <p className="text-slate-600 mt-0.5">
                      {business.openingHours || 'Monday to Saturday: 9:00 AM - 8:00 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${business.name} ${business.address} ${business.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="flex justify-center">
            <BusinessInquiryForm
              businessId={business.id}
              businessName={business.name}
              ctaText={business.ctaText || 'Send Inquiry'}
            />
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
