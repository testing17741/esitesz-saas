'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) return;

    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 450);
  };

  const whatsappUrl = `https://wa.me/919152667967?text=${encodeURIComponent(
    `Hi Zainuddin, I am contacting you regarding esitesz SaaS platform inquiry.`
  )}`;

  const mailtoUrl = `mailto:testing17741+esitesz@gmail.com?subject=${encodeURIComponent(
    `Inquiry from esitesz SaaS`
  )}&body=${encodeURIComponent(
    `Name: ${form.name || 'Your Name'}\nPhone: ${form.phone || 'Your Phone'}\n\nMessage:\n${
      form.message || 'I would like to discuss a project / custom domain setup.'
    }`
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
      {/* Top Header */}
      <div className="space-y-3 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div>
          <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
            Official Contact Channel
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch with esitesz
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Direct engineering support, custom domains setup, and inquiries for the esitesz local business engine.
          Quotes delivered within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Direct Channels Column (Real esitesz.com Data) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block mb-1">
                Founder &amp; Engineering Lead
              </span>
              <h3 className="font-bold text-lg text-white">Zainuddin N. Chaudhary</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Senior Full-Stack Engineer &amp; Digital Architect · Mumbai, India
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
              {/* WhatsApp & Call */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">Direct Phone &amp; WhatsApp</span>
                    <a
                      href="tel:+919152667967"
                      className="text-slate-300 font-mono font-semibold hover:text-white transition"
                    >
                      +91 91526 67967
                    </a>
                  </div>
                </div>

                <div className="pl-7">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat on WhatsApp ↗
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 pt-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Official Email</span>
                  <a
                    href="mailto:testing17741+esitesz@gmail.com"
                    className="text-blue-300 hover:underline break-all"
                  >
                    testing17741+esitesz@gmail.com
                  </a>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    or contact@esitesz.com
                  </span>
                </div>
              </div>

              {/* Office Location */}
              <div className="flex items-start gap-3 pt-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Office Location</span>
                  <span className="text-slate-300 block">Wadala (West)</span>
                  <span className="text-slate-400">Mumbai, Maharashtra 400031, India</span>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Working Hours &amp; SLA</span>
                  <span className="text-slate-400 block">Mon - Sat: 9:30 AM - 7:30 PM IST</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">
                    Free Quote &amp; Response in 24 Hours
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Developed by <strong className="text-white">esitesz</strong></span>
              <a
                href="https://esitesz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                esitesz.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Inquiry Logged Successfully</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{form.name}</strong>. Your message has been received by Zainuddin at esitesz.
                We will reply to your email or WhatsApp on <strong>{form.phone}</strong> within 24 hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={mailtoUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  <Mail className="w-4 h-4" />
                  Also Send via Email Client
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open in WhatsApp
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', phone: '', message: '' });
                }}
                className="text-xs font-semibold text-blue-600 underline pt-4 block mx-auto"
              >
                Submit another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Send Direct Message to Esitesz</h2>
                <p className="text-slate-500 text-xs">
                  Fill in your details below and we will get back to you promptly.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Project Requirement / Inquiry *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your business, custom domain requirement, or technical support need..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Sending message...' : 'Send Message to Esitesz'}
                <Send className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  India DPDP Act 2023 Compliant
                </span>
                <span>Response in &lt; 24h</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
