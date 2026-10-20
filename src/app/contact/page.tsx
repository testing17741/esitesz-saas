'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="space-y-3 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
          Support &amp; Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch with esitesz
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Need technical assistance, custom domain setup, or enterprise deployment? Our engineering team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-base">Direct Channels</h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Email Support</span>
                  <a href="mailto:support@esitesz.com" className="text-slate-400 hover:underline">
                    support@esitesz.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">WhatsApp &amp; Phone</span>
                  <span className="text-slate-400">+91 91520 00000</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Office Location</span>
                  <span className="text-slate-400">Mumbai &amp; Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Developed by <span className="text-white font-bold">esitesz</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting esitesz. A member of our team will respond to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-blue-600 underline pt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900 mb-2">Send Us a Direct Message</h2>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Your Message or Question *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry, custom domain request, or feedback..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Sending message...' : 'Submit Message'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
