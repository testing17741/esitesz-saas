import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  generateLocalBusinessSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
  generateAeoSummary,
} from '@/lib/seo-aeo';
import { BusinessInquiryForm } from '@/components/BusinessInquiryForm';
import { StickyMobileBar } from '@/components/StickyMobileBar';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star,
  FileSpreadsheet,
  Globe,
} from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
  });

  if (!business) {
    return { title: 'Business Not Found | esitesz' };
  }

  const title = business.metaTitle || `${business.name} — ${business.category} in ${business.city}`;
  const description =
    business.metaDescription ||
    business.headline ||
    `${business.name} provides trusted ${business.category} services in ${business.city}. Call ${business.phone} for details.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/biz/${business.slug}`;

  return {
    title,
    description,
    keywords: business.keywords || `${business.name}, ${business.category}, ${business.city}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: business.name,
      locale: 'en_IN',
      type: 'website',
      images: business.heroImageUrl ? [{ url: business.heroImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: business.heroImageUrl ? [business.heroImageUrl] : undefined,
    },
  };
}

export default async function BusinessPublicPage({ params }: PageProps) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      services: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { createdAt: 'desc' } },
      faqs: { orderBy: { order: 'asc' } },
      leads: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  if (!business) {
    notFound();
  }

  // Handle Moderation Status
  if (business.status !== 'APPROVED') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">{business.name}</h1>
            <p className="text-xs font-semibold uppercase text-amber-700 tracking-wider">
              Listing Status: {business.status}
            </p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            This business storefront is currently under moderation review by esitesz administration or temporarily unavailable.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              Explore Verified Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const localBusinessSchema = generateLocalBusinessSchema(business, baseUrl);
  const faqSchema = generateFaqSchema(business.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema(business, baseUrl);
  const aeoDigest = generateAeoSummary(business);

  const cleanPhone = business.phone.replace(/[^0-9]/g, '');
  const cleanWa = business.whatsapp.replace(/[^0-9]/g, '');
  const waNumber = cleanWa.startsWith('91') ? cleanWa : `91${cleanWa}`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(business.whatsappMessage || '')}`;

  return (
    <div className="bg-slate-50 text-slate-800 pb-24 md:pb-0 relative min-h-screen">
      {/* Structured JSON-LD Data for SEO, AEO & Google Maps */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hidden AEO text summary for AI Bots / LLM indexers */}
      <div className="sr-only" aria-hidden="true">
        <h2>AI Knowledge Graph &amp; AEO Summary</h2>
        <pre>{aeoDigest}</pre>
      </div>

      {/* Multi-Page Navigation Header */}
      <StorefrontHeader business={business} />

      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {business.category} in {business.city}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 uppercase leading-tight tracking-tight">
                {business.headline || business.name}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {business.description ||
                  `Welcome to ${business.name}. We provide high quality, dedicated and prompt services across ${business.city} and surrounding areas.`}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                <a
                  href={`tel:${business.phone}`}
                  className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Phone className="w-4 h-4" />
                  Call {business.phone}
                </a>
              </div>

              {business.openingHours && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hours: {business.openingHours}</span>
                </div>
              )}
            </div>

            {/* Hero Shop / Service Photo */}
            <div className="relative">
              {business.heroImageUrl ? (
                <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                  <img
                    src={business.heroImageUrl}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
                    <p className="font-bold">{business.name}</p>
                    <p className="text-[11px] text-slate-300">{business.address}, {business.city}</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-72 md:h-96 w-full placeholder-box rounded-2xl flex flex-col items-center justify-center text-center p-8 border border-blue-200">
                  <span className="label-tag right-auto left-1/2 transform -translate-x-1/2">
                    Verified Storefront
                  </span>
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <p className="text-blue-900 font-extrabold text-lg">{business.name}</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs">
                    {business.address}, {business.city}, {business.state} {business.pincode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services / Offerings Grid */}
      {business.services.length > 0 && (
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">
                Services &amp; Offerings
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3">What We Offer</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Explore our full suite of solutions tailored for customers in {business.city}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {business.services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="relative p-6 border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {idx + 1}
                    </div>
                    {srv.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                    {srv.description || 'Professional execution with standard warranty and dedicated support.'}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                    <span className="font-extrabold text-sm text-emerald-700">
                      {srv.price || 'Direct Estimate'}
                    </span>
                    <a
                      href="#inquire"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      Inquire <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The "Magic" Section: Automated Inquiry System (From Website to Phone / Leads Sheet) */}
      <section id="inquire" className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-green-400">
              ● Automated Inquiry System
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Send Your Inquiry Directly To {business.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Data is synced in real-time to the business dashboard &amp; leads phone sheet.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* The Live Interactive Form */}
            <div className="w-full max-w-sm">
              <BusinessInquiryForm
                businessId={business.id}
                businessName={business.name}
                ctaText={business.ctaText || 'Send Inquiry'}
              />
            </div>

            {/* Connection Arrow */}
            <div className="flex flex-col items-center">
              <div className="h-1 w-12 md:w-24 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
              <div className="p-2 rounded-full bg-slate-800 text-green-400 border border-green-500/30 my-2">
                <ArrowRight className="w-5 h-5 md:rotate-0 rotate-90" />
              </div>
              <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest">
                INSTANT DATA SYNC
              </span>
            </div>

            {/* The Live Sheet Visual (Client Side Preview) */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl text-slate-800 border border-slate-200">
              <span className="absolute -top-3 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                Owner&apos;s Live Sheet
              </span>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 space-y-2 font-sans">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-xs text-slate-800">
                    {business.slug}_Leads_Sheet.xlsx
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold text-slate-700">
                  <div className="bg-emerald-200/80 p-1 rounded">Customer</div>
                  <div className="bg-emerald-200/80 p-1 rounded">Phone</div>
                  <div className="bg-emerald-200/80 p-1 rounded">Status</div>
                </div>

                {business.leads.length > 0 ? (
                  business.leads.map((l) => (
                    <div key={l.id} className="grid grid-cols-3 gap-1 text-[10px] font-mono bg-white p-1 rounded border border-emerald-100 text-slate-600">
                      <div className="truncate font-medium">{l.name}</div>
                      <div className="truncate">{l.phone.slice(0, 7)}...</div>
                      <div className="text-emerald-700 font-bold">{l.status}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono bg-white p-1 rounded border border-emerald-100 text-slate-600">
                      <div>Rohan K.</div>
                      <div>9812...</div>
                      <div className="text-emerald-700 font-bold">New</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono bg-white p-1 rounded border border-emerald-100 text-slate-600">
                      <div>Amit S.</div>
                      <div>8800...</div>
                      <div className="text-slate-500 font-medium">Contacted</div>
                    </div>
                  </>
                )}

                <div className="pt-1 text-center">
                  <span className="text-[9px] text-emerald-800 font-medium">
                    ⚡ Leads automatically appear in the business dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured FAQs Section (AEO - Answer Engine Optimization) */}
      {business.faqs.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Direct Answers For Your Questions</h2>
              <p className="text-xs text-slate-500">
                Clear answers formatted for search engines and direct customer clarity.
              </p>
            </div>

            <div className="space-y-3">
              {business.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2"
                >
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600 font-bold">Q:</span> {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Map Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Location &amp; Visit</span>
                <h2 className="text-2xl font-bold text-slate-900">Find {business.name}</h2>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {business.address}, {business.city}, {business.state} — {business.pincode}, {business.country}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{business.phone}</span>
                  </p>
                  {business.openingHours && (
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{business.openingHours}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${business.name} ${business.address} ${business.city}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Get Directions on Google Maps
                  </a>
                </div>
              </div>

              {/* Map embed placeholder / visual */}
              <div className="aspect-video w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-4">
                <MapPin className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-xs font-bold text-slate-800">{business.city}, {business.state}</p>
                <p className="text-[11px] text-slate-500 mt-1">Geo-optimized for Google Local Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Blueprint (Matching samplebyesitesz) */}
      <footer className="bg-slate-900 text-white py-12 border-t-4 border-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">About Business</span>
            <p className="font-bold text-base text-white">{business.name}</p>
            <p className="text-slate-400 leading-relaxed">
              {business.tagline || 'Committed to delivering trusted quality and service excellence.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Direct Contact</span>
            <p className="text-slate-300">Phone: {business.phone}</p>
            <p className="text-slate-300">WhatsApp: {business.whatsapp}</p>
            <p className="text-slate-300">{business.city}, {business.state}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Storefront Platform</span>
            <p className="text-slate-400">
              This verified digital business storefront is powered by{' '}
              <Link href="/" className="text-blue-400 font-semibold underline">
                esitesz
              </Link>.
            </p>
            <p className="pt-2 text-[11px] text-slate-400">
              Developed by <span className="text-white font-semibold">esitesz</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Action Bar for Mobile Visitors */}
      <StickyMobileBar
        phone={business.phone}
        whatsapp={business.whatsapp}
        whatsappMessage={business.whatsappMessage || ''}
      />
    </div>
  );
}
