import Link from 'next/link';
import { prisma } from '@/lib/db';
import { InteractiveBlueprint } from '@/components/InteractiveBlueprint';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  MapPin,
  ExternalLink,
  Zap,
  Globe,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let businesses: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    city: string;
    state: string;
    phone: string;
    headline: string | null;
    _count: { services: number; leads: number };
  }> = [];

  try {
    businesses = await prisma.business.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        city: true,
        state: true,
        phone: true,
        headline: true,
        _count: {
          select: { services: true, leads: true },
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching businesses for homepage', e);
  }

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Local Business Engine &amp; Automated Inquiry System</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="font-bold text-slate-900">Developed by esitesz</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Turn Local Customers Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">
            Real WhatsApp Leads &amp; Google Sheet Data
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          Create your verified business storefront in 60 seconds. Every customer inquiry submitted on your page
          automatically syncs directly into your personal Google Sheet and delivers to your phone in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95"
          >
            Create Your Storefront (Free)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#blueprint"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition"
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            Explore Storefront Architecture
          </a>
        </div>

        <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click WhatsApp Inquiries
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Realtime Google Sheets Sync
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Google Maps &amp; AEO Schema
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Super Admin Quality Moderation
          </span>
        </div>
      </section>

      {/* Interactive Architecture Blueprint (Matching samplebyesitesz.esitesz.com) */}
      <InteractiveBlueprint />

      {/* Core Platform Capabilities */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Engine Pillars</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Built For High-Converting Local Growth</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Everything your business needs to capture inquiries, automate lead recording, and rank in local searches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Instant WhatsApp &amp; Call Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customers can contact you with 1 tap via WhatsApp pre-filled messages or direct phone calls, maximizing high-intent conversions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Live Google Sheets Webhook Sync</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your personal Google Sheet webhook in your business settings. Every inquiry is instantly written to your sheet with 0 extra subscription fees.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">AEO &amp; Google Maps GEO SEO</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Native schema.org JSON-LD (LocalBusiness, FAQPage, Breadcrumbs) generated automatically so Google Search, Maps, and AI answer engines cite your business accurately.
            </p>
          </div>
        </div>
      </section>

      {/* Live Directory of Verified Businesses */}
      {businesses.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Business Storefronts</h2>
              <p className="text-xs text-slate-500">Live verified businesses deployed on the esitesz engine.</p>
            </div>
            <Link
              href="/dashboard/new"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Add Your Business <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-200">
                      {biz.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900">{biz.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {biz.headline || `Trusted provider of services in ${biz.city}.`}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{biz.city}, {biz.state}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {biz._count.services} Offerings
                  </span>
                  <Link
                    href={`/biz/${biz.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Visit Storefront <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Footer Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              Ready in 60 Seconds
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Launch Your Business Storefront Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              No code required. Fill in your details, publish instantly, and start receiving direct WhatsApp inquiries and Google Sheet sync.
            </p>
          </div>

          <div className="flex justify-center relative z-10">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition active:scale-95"
            >
              Get Started with Email OTP
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-[11px] text-slate-500 relative z-10">
            Developed by <span className="text-slate-300 font-bold">esitesz</span> • DPDP Act 2023 Compliant
          </p>
        </div>
      </section>
    </div>
  );
}
