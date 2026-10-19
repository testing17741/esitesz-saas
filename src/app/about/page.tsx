import Link from 'next/link';
import { ShieldCheck, Layers, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="space-y-3 text-center">
        <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
          About esitesz
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Local Businesses with Instant Digital Engines
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          esitesz was developed to bridge the gap between traditional local shops and modern AI-driven discovery,
          turning everyday visitors into direct WhatsApp customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-base text-slate-900">Developed by esitesz</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crafted with production-grade engineering, strict DPDP Act compliance, and zero AI-slop design.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-base text-slate-900">Direct-to-Phone Sync</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Customer inquiries flow directly into a structured leads sheet on the owner&apos;s phone with instant WhatsApp triggers.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-base text-slate-900">AEO &amp; GEO First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered so Google Maps and AI answer engines like ChatGPT and Gemini cite your local shop accurately.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Our Architecture &amp; Free Infrastructure Promise</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            esitesz is designed to run seamlessly on modern cloud free tiers (Next.js serverless API routes on Vercel,
            SQLite with zero-maintenance, or free PostgreSQL via Neon/Supabase) while easily scaling to millions of hits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero server management overhead</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cryptographic passwordless OTP authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>DPDP Act 2023 statutory data minimization</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Custom domain &amp; SSL included</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow"
          >
            Create Your Business Engine Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
