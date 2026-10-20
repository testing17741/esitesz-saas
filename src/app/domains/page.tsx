'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, CheckCircle2, AlertCircle, Server, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DomainsPage() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    domainType: 'CUSTOM_DOMAIN',
    domainName: '',
    businessSlug: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit domain connection request');
      }

      setFeedback({
        type: 'success',
        message: data.data.message || 'Domain request submitted successfully! We will connect it within 24 hours.',
      });
      setForm({
        email: '',
        phone: '',
        domainType: 'CUSTOM_DOMAIN',
        domainName: '',
        businessSlug: '',
        notes: '',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error submitting request',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
          Custom Domain &amp; Subdomain Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect Your Own Domain to Your Storefront
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Brand your business with a custom domain (e.g. <code className="text-blue-700 bg-slate-100 px-1 py-0.5 rounded">yourbusiness.in</code>)
          or claim a free branded subdomain (<code className="text-blue-700 bg-slate-100 px-1 py-0.5 rounded">yourbrand.esitesz.com</code>).
        </p>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition"
          >
            Business Owners: Manage Domains Directly Inside Dashboard &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Domain Connection Request</h2>
            <p className="text-xs text-slate-500">
              Provide your domain details below. We handle the SSL encryption and routing setup.
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Domain Type Selection */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Domain Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, domainType: 'CUSTOM_DOMAIN' })}
                  className={`p-3 rounded-lg border text-left transition ${
                    form.domainType === 'CUSTOM_DOMAIN'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs">Custom Domain</span>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">e.g. myshop.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, domainType: 'SUBDOMAIN' })}
                  className={`p-3 rounded-lg border text-left transition ${
                    form.domainType === 'SUBDOMAIN'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs">Free Subdomain</span>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">e.g. shop.esitesz.com</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                {form.domainType === 'CUSTOM_DOMAIN' ? 'Your Custom Domain *' : 'Desired Subdomain *'}
              </label>
              <input
                type="text"
                required
                placeholder={form.domainType === 'CUSTOM_DOMAIN' ? 'e.g. sharmaelectricals.in' : 'e.g. sharma.esitesz.com'}
                value={form.domainName}
                onChange={(e) => setForm({ ...form, domainName: e.target.value.toLowerCase().trim() })}
                className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Target Business Slug (Optional)</label>
              <input
                type="text"
                placeholder="e.g. samplebyesitesz"
                value={form.businessSlug}
                onChange={(e) => setForm({ ...form, businessSlug: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-mono"
              />
              <p className="text-[10px] text-slate-400">
                The business storefront slug on esitesz you want this domain to map to.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">DNS Registrar / Notes</label>
              <textarea
                rows={2}
                placeholder="Where is your domain registered? (GoDaddy, Namecheap, Hostinger, Cloudflare...)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Domain Connection Request'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* DNS Guide Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-sm border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400">
              <Server className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">DNS Configuration Steps</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If using a Custom Domain, add the following CNAME record in your domain DNS manager:
            </p>

            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px] uppercase">
                <span>Record</span>
                <span>Name</span>
                <span>Target</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-1">
                <span>CNAME</span>
                <span>@ or www</span>
                <span className="truncate">cname.vercel-dns.com</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Automatic Free SSL (HTTPS) Certificate
              </p>
              <p className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                Zero Downtime Global CDN Delivery
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2 text-xs text-blue-900">
            <h4 className="font-bold">Need Help Connecting?</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Our engineers assist with DNS records setup directly over WhatsApp or email at zero additional cost.
            </p>
            <div className="pt-1 flex flex-col gap-1 text-xs">
              <a
                href="https://wa.me/919152667967?text=Hi%20Zainuddin,%20I%20need%20help%20connecting%20a%20custom%20domain%20on%20esitesz."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:text-emerald-800"
              >
                WhatsApp: +91 91526 67967 ↗
              </a>
              <a
                href="mailto:testing17741+esitesz@gmail.com"
                className="font-bold text-blue-700 underline text-xs"
              >
                testing17741+esitesz@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
