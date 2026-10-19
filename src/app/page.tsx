import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Zap,
  Globe,
  CheckCircle2,
  Smartphone,
  Server,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Query approved businesses for the live directory section
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

  let latestLeads: Array<{
    id: string;
    name: string;
    phone: string;
    requirement: string;
    status: string;
    createdAt: Date;
    business: { name: string; slug: string };
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

    latestLeads = await prisma.businessLead.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        requirement: true,
        status: true,
        createdAt: true,
        business: {
          select: { name: true, slug: true },
        },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching data for homepage', e);
  }

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>The Next-Generation Local Business Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="font-bold text-slate-900">Developed by esitesz</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Turn Local Visitors Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">
            Direct WhatsApp &amp; Phone Leads
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          Create your verified business storefront in 60 seconds. Powered by instant Email OTP login,
          real-time inquiry sheets sync to your phone, and built-in AEO (AI Search Engine Optimization) &amp; GEO local rankings.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95"
          >
            Create Your Business Page (Free)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#sync"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            View Inquiry Sheet Sync
          </a>
          <Link
            href="/domains"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition"
          >
            <Server className="w-4 h-4 text-blue-600" />
            Connect Custom Domain
          </Link>
        </div>

        <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Passwordless Email OTP
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Phone Sheet Sync
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Google Maps &amp; AEO Schema
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Super Admin Quality Moderation
          </span>
        </div>
      </section>

      {/* Interactive Blueprint Reference Showcase (Matches samplebyesitesz.esitesz.com) */}
      <section id="sample-preview" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-xl overflow-hidden">
          {/* Top Blueprint Bar */}
          <div className="bg-slate-900 text-white px-4 py-2 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="ml-2 opacity-80 text-[11px]">samplebyesitesz.esitesz.com — Architecture Showcase</span>
            </div>
            <span className="text-emerald-400 font-bold uppercase text-[10px]">Active Blueprint</span>
          </div>

          <div className="p-6 md:p-10 space-y-8 bg-slate-50/50">
            {/* Header Blueprint Row */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative">
                <div className="h-10 w-36 placeholder-box rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs border border-blue-500 border-dashed px-2 py-0.5 rounded">
                    YOUR LOGO
                  </span>
                </div>
                <span className="label-tag -top-2.5 left-2">Upload Logo</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Call Us</span>
                  <span className="text-xs font-mono font-bold bg-amber-100 px-2 py-0.5 rounded text-slate-800">
                    +91 XXXXX XXXXX
                  </span>
                </div>
                <div className="h-9 px-4 placeholder-box rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                  CTA Button
                </div>
              </div>
            </div>

            {/* Hero Blueprint Row */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="placeholder-box p-4 rounded-xl">
                  <span className="text-xs uppercase font-mono font-bold text-blue-600 block mb-1">
                    [ Headline Token ]
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-700 uppercase">
                    YOUR MAIN <span className="text-blue-600">HEADLINE HERE</span>
                  </h3>
                </div>

                <div className="placeholder-box p-3 rounded-lg text-xs text-slate-500">
                  Short description about your business, what you sell, and why customers in your city should choose you.
                </div>

                <div className="flex gap-3 pt-2">
                  <div className="h-10 px-4 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold gap-1.5 shadow">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </div>
                  <div className="h-10 px-4 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold gap-1.5 shadow">
                    <Phone className="w-3.5 h-3.5" /> Call Now
                  </div>
                </div>
              </div>

              {/* Hero Image Blueprint */}
              <div className="relative h-56 md:h-64 placeholder-box rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-blue-300">
                <span className="label-tag -top-3 left-1/2 transform -translate-x-1/2">
                  Your Hero Image
                </span>
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-blue-900">Your Main Shop / Service Photo</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Upload photos of your storefront, best products, or certified team.
                </p>
              </div>
            </div>

            {/* Services Grid Blueprint */}
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  What do you offer?
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="p-4 border border-slate-200 rounded-xl bg-white text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                      #{num}
                    </div>
                    <div className="h-4 w-3/4 bg-slate-200 mx-auto rounded" />
                    <div className="h-3 w-5/6 bg-slate-100 mx-auto rounded" />
                    <span className="text-[10px] font-bold text-blue-600 block">Service Offering {num}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Magic Section Preview: Form to Sheet with id="sync" */}
            <div id="sync" className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 scroll-mt-24">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  The Automated Inquiry System (Form to Sheet)
                </div>
                <h4 className="text-lg md:text-xl font-bold">Instant Inquiry Data Sync</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  When a customer fills the form on your website, it writes directly into your database sheet and syncs to your phone.
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="bg-white text-slate-900 rounded-xl p-4 w-full max-w-xs space-y-2 text-xs shadow-lg">
                  <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">
                    On Your Website
                  </span>
                  <div className="h-7 border border-slate-300 rounded px-2 flex items-center text-slate-400">Customer Name</div>
                  <div className="h-7 border border-slate-300 rounded px-2 flex items-center text-slate-400">Phone Number</div>
                  <div className="h-12 border border-slate-300 rounded px-2 flex items-center text-slate-400">Requirement...</div>
                  <div className="h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold">
                    Send Enquiry
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-slate-800 text-green-400 border border-green-500/40">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-green-400 uppercase mt-1">
                    REALTIME SYNC
                  </span>
                </div>

                {/* Actual Leads Sheet Representation */}
                <div className="bg-white text-slate-900 rounded-xl p-4 w-full max-w-xs space-y-2 text-xs shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">
                      On Your Phone / Dashboard
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                  </div>

                  <div className="bg-green-50 rounded p-2.5 border border-green-200 font-mono text-[10px] space-y-1.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-green-200">
                      <div className="flex items-center gap-1 font-bold text-emerald-800">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" /> Leads_Sheet.xlsx
                      </div>
                      <span className="text-[9px] font-sans text-emerald-700 font-semibold">Realtime</span>
                    </div>

                    <div className="grid grid-cols-3 font-bold text-slate-700 pt-0.5 text-[9px] uppercase tracking-wider">
                      <span>Customer</span>
                      <span>Phone</span>
                      <span className="text-right">Project</span>
                    </div>

                    {latestLeads.length > 0 ? (
                      latestLeads.map((lead) => (
                        <div key={lead.id} className="grid grid-cols-3 items-center text-[10px] bg-white p-1.5 rounded border border-emerald-100 text-slate-700">
                          <span className="font-semibold truncate">{lead.name}</span>
                          <span className="text-slate-500 truncate">{lead.phone.slice(0, 8)}..</span>
                          <Link
                            href={`/biz/${lead.business.slug}`}
                            className="text-right text-blue-600 hover:underline truncate font-medium text-[9px]"
                            title={`View project: ${lead.business.name}`}
                          >
                            {lead.business.slug}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="grid grid-cols-3 text-slate-600 bg-white p-1 rounded border">
                          <span>Rohan K.</span>
                          <span>9812...</span>
                          <span className="text-emerald-700 font-bold text-right">samplebyesitesz</span>
                        </div>
                        <div className="grid grid-cols-3 text-slate-600 bg-white p-1 rounded border">
                          <span>Amit S.</span>
                          <span>8800...</span>
                          <span className="text-emerald-700 font-bold text-right">samplebyesitesz</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Action Bar Highlight without AI emoji */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900">
                <Smartphone className="w-4 h-4 text-blue-700" />
                <span>Fixed Sticky Bottom Action Bar Included on Smartphones</span>
              </div>
              <p className="text-[11px] text-blue-700">
                Docked WhatsApp and Call buttons remain permanently accessible on customer mobile viewports for maximum lead conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Engine Pillars</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Engineered For Zero Friction Local Growth</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Everything your business needs to be found on Google, answer AI searches, and capture high-intent inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Passwordless Email OTP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No passwords to compromise. Sign in securely in seconds with 6-digit cryptographic verification codes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Instant Lead Sheet Sync</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer inquiries submitted on your site are immediately logged in your dashboard and ready to export into Excel or Google Sheets.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">AEO &amp; GEO Optimization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Native schema.org JSON-LD (LocalBusiness &amp; FAQPage) embedded so AI answer engines like ChatGPT and Gemini cite your business accurately.
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
              Launch Your Business Engine Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              No code required. Fill in your details, publish instantly, and start receiving direct WhatsApp inquiries.
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
