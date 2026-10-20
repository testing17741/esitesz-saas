'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Laptop,
  Tablet,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';

export function DeviceBlueprintShowcase() {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryReq, setInquiryReq] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTestInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setInquirySent(true);
    triggerToast('Inquiry recorded! Realtime sync triggered to Google Sheet & leads dashboard.');
  };

  return (
    <section id="blueprint" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Device Viewport Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Storefront Viewport Tester
          </span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            — Test how your business appears across devices
          </span>
        </div>

        {/* Device Switcher Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              device === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laptop / Desktop</span>
            <span className="sm:hidden">Laptop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              device === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              device === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-blue-500/40 text-xs flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Outer Device Frame Container */}
      <div className="flex justify-center transition-all duration-300">
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            device === 'desktop'
              ? 'max-w-5xl'
              : device === 'tablet'
              ? 'max-w-[768px] border-8 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden'
              : 'max-w-[390px] border-[10px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative'
          }`}
        >
          {/* Mobile Speaker Notch */}
          {device === 'mobile' && (
            <div className="bg-slate-900 h-6 flex items-center justify-center">
              <div className="w-20 h-3.5 bg-black rounded-full" />
            </div>
          )}

          {/* Browser Window Bar for Desktop/Tablet */}
          {device !== 'mobile' && (
            <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-mono flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="ml-2 text-slate-300 text-[11px] font-sans truncate">
                  samplebyesitesz.esitesz.com — Architecture Showcase
                </span>
              </div>
              <Link
                href="/biz/samplebyesitesz"
                target="_blank"
                className="text-emerald-400 hover:text-emerald-300 font-bold uppercase text-[10px] flex items-center gap-1 shrink-0"
              >
                Live Storefront <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Screen Content Wrapper */}
          <div className="bg-white border border-slate-200 overflow-hidden relative">
            {/* Storefront Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 px-3 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center bg-blue-50/50">
                  <span className="text-blue-600 font-black text-xs tracking-tight">YOUR LOGO</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Contact Line</span>
                  <span className="text-xs font-bold text-slate-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                    contact@esitesz.com
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Direct inquiry form opened.')}
                  className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition"
                >
                  Send Inquiry
                </button>
              </div>
            </header>

            {/* Storefront Hero Section */}
            <div className={`p-4 sm:p-6 md:p-8 bg-slate-50/60 space-y-6 ${device === 'mobile' ? 'pb-24' : ''}`}>
              <div className={`grid gap-6 items-center ${device === 'desktop' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Hero Left Content */}
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider inline-block">
                    Verified Local Business
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                    YOUR BUSINESS <span className="text-blue-600">HEADLINE HERE</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Highlight what makes your local business trusted in your city. Provide quick quotes, pricing, and guaranteed customer satisfaction.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerToast('WhatsApp CTA Triggered: Opens pre-filled chat with business owner.')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast('Direct Call Triggered: Opens phone dialer with business line.')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow transition active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Direct
                    </button>
                  </div>
                </div>

                {/* Hero Right Media Preview */}
                <div className="bg-white border border-blue-200 rounded-2xl p-5 text-center shadow-sm space-y-2 flex flex-col items-center justify-center min-h-[160px]">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Storefront Photo &amp; Location Map</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Upload photos of your storefront, team, or catalog items. Automatically linked with Google Maps GEO coordinates.
                  </p>
                </div>
              </div>

              {/* Service Catalog Row */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Services &amp; Offerings Catalog
                  </h4>
                  <span className="text-[10px] text-blue-600 font-semibold font-mono">Real-time Catalog</span>
                </div>

                <div className={`grid gap-3 ${device === 'desktop' ? 'grid-cols-3' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {[
                    { title: 'Core Primary Service Offering', price: '₹999 onwards', badge: 'Most Popular' },
                    { title: 'Express Consultation & Assessment', price: 'Free Quote', badge: 'Quick Response' },
                    { title: 'Comprehensive Setup & Execution', price: 'Custom Quote', badge: 'Full Warranty' },
                  ].map((srv, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {srv.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700">{srv.price}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{srv.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Guaranteed turnaround with complete customer support.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive In-Showcase Inquiry Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Interactive Customer Inquiry Form
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    Syncs to Google Sheets
                  </span>
                </div>

                {inquirySent ? (
                  <div className="py-4 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Inquiry Simulated Successfully!</p>
                    <p className="text-[11px] text-slate-500">
                      When live, this lead lands instantly in your WhatsApp, Database, and connected Google Sheet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySent(false)}
                      className="text-xs text-blue-600 underline font-semibold"
                    >
                      Reset Test Form
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTestInquiry} className="space-y-3">
                    <div className={`grid gap-2.5 ${device === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      <input
                        type="text"
                        placeholder="Customer Name (e.g. Rahul Sharma)"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        required
                        className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. +91 91520 00000)"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        required
                        className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Requirement (e.g. Need service quote in Pune)"
                      value={inquiryReq}
                      onChange={(e) => setInquiryReq(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Test Send Inquiry &amp; Sheet Sync
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Fixed Sticky Bottom Action Bar for Mobile View */}
            {device === 'mobile' && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2.5 shadow-2xl z-30 flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerToast('Docked Mobile WhatsApp: One-click customer contact')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Docked Mobile Call: Instant phone dialer launch')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
