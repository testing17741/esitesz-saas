'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  MessageCircle,
  Phone,
  Image as ImageIcon,
  Star,
  Wrench,
  Truck,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  MapPin,
  Send,
} from 'lucide-react';

interface SheetLead {
  id: string;
  name: string;
  phone: string;
  time: string;
  isNew?: boolean;
}

export function InteractiveBlueprint() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncCount, setSyncCount] = useState(0);

  const [leads, setLeads] = useState<SheetLead[]>([
    { id: '1', name: 'Rohan K.', phone: '+91 98120...', time: 'Just Now' },
    { id: '2', name: 'Amit S.', phone: '+91 88001...', time: '12 min ago' },
    { id: '3', name: 'Priya M.', phone: '+91 99234...', time: '1 hr ago' },
  ]);

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSyncing(true);

    setTimeout(() => {
      const newLead: SheetLead = {
        id: String(Date.now()),
        name: name.trim(),
        phone: phone.trim().slice(0, 8) + '...',
        time: 'Just Now',
        isNew: true,
      };

      setLeads((prev) => [newLead, ...prev.slice(0, 4)]);
      setSyncCount((c) => c + 1);
      setName('');
      setPhone('');
      setRequirement('');
      setSyncing(false);
    }, 400);
  };

  const handleAutoFillDemo = () => {
    const demoNames = ['Vikram Malhotra', 'Sneha Patel', 'Rajesh Gupta', 'Ananya Deshmukh'];
    const demoPhones = ['+91 98201 44552', '+91 91520 88910', '+91 98900 12345', '+91 97654 32100'];
    const demoReqs = ['Need service quote for home visit', 'Commercial project inquiry', 'Interested in annual service plan'];

    const randomIdx = Math.floor(Math.random() * demoNames.length);
    setName(demoNames[randomIdx]);
    setPhone(demoPhones[randomIdx]);
    setRequirement(demoReqs[randomIdx % demoReqs.length]);
  };

  return (
    <section id="blueprint" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300 text-xs">
            Architecture Blueprint Demonstration:
          </span>
          <span className="text-slate-400 text-xs">
            Visual template inspired by samplebyesitesz.esitesz.com
          </span>
        </div>
        <Link
          href="/biz/samplebyesitesz"
          target="_blank"
          className="text-emerald-400 hover:text-emerald-300 font-bold uppercase text-[11px] flex items-center gap-1.5 transition"
        >
          Open Live Storefront <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Blueprint Box */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-2xl overflow-hidden">
        {/* Browser Top Bar */}
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-mono flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="ml-2 opacity-80 text-[11px]">samplebyesitesz.esitesz.com</span>
          </div>
          <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
            Interactive Blueprint
          </span>
        </div>

        {/* 1. Header Section */}
        <header className="bg-white border-b border-slate-200 p-4 sm:p-6">
          <div className="flex justify-between items-center gap-4">
            {/* Logo Placeholder */}
            <div className="relative group">
              <div className="h-12 w-40 placeholder-box rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-black text-sm border-2 border-blue-600 px-2 py-0.5 border-dashed rounded">
                  YOUR LOGO
                </span>
              </div>
              <span className="label-tag">We upload your logo</span>
            </div>

            {/* Contact Placeholder */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Call Us</span>
                <span className="text-sm font-black text-slate-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                  +91 XXXXX XXXXX
                </span>
              </div>
              <div className="h-10 px-4 placeholder-box rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                CTA Button
              </div>
            </div>
          </div>
        </header>

        {/* 2. Hero Section */}
        <div className="p-6 sm:p-10 bg-slate-50/50 space-y-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column: Text Content Placeholder */}
            <div className="relative space-y-5">
              {/* Red handwritten instruction arrow */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-red-500 font-mono absolute -top-7 left-2">
                <span>We write your main offer here</span>
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="placeholder-box p-5 sm:p-6 rounded-2xl relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-300 uppercase leading-tight tracking-tight">
                  YOUR MAIN <br />
                  <span className="text-blue-600">HEADLINE HERE</span>
                </h1>
              </div>

              <div className="placeholder-box p-4 rounded-xl bg-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  We will write a clear, engaging description about your business, what you sell, and why customers in your city should choose you.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-11 px-5 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xs gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </div>
                <div className="h-11 px-5 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xs gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image Placeholder */}
            <div className="relative h-64 md:h-80 w-full placeholder-box rounded-3xl flex flex-col items-center justify-center text-center p-6 sm:p-8">
              <span className="label-tag -top-3 left-1/2 transform -translate-x-1/2">
                Your Hero Image
              </span>
              <ImageIcon className="w-12 h-12 text-blue-300 mb-3" />
              <p className="text-blue-600 font-bold text-sm">Your Main Shop / Service Photo</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Send us a photo of your storefront, best products, or certified team.
              </p>
            </div>
          </div>

          {/* 3. Services / Features Grid */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-1">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Your Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                What do you offer?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Service 1 */}
              <div className="relative p-6 border border-slate-200 rounded-2xl bg-white text-center space-y-3 group hover:border-blue-300 transition">
                <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                <div className="h-3 w-full bg-slate-100 mx-auto rounded" />
                <div className="h-3 w-5/6 bg-slate-100 mx-auto rounded" />
                <div className="pt-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Service Offering 1
                  </span>
                </div>
              </div>

              {/* Service 2 */}
              <div className="relative p-6 border border-slate-200 rounded-2xl bg-white text-center space-y-3 group hover:border-blue-300 transition">
                <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <Wrench className="w-6 h-6 text-blue-500" />
                </div>
                <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                <div className="h-3 w-full bg-slate-100 mx-auto rounded" />
                <div className="h-3 w-5/6 bg-slate-100 mx-auto rounded" />
                <div className="pt-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Service Offering 2
                  </span>
                </div>
              </div>

              {/* Service 3 */}
              <div className="relative p-6 border border-slate-200 rounded-2xl bg-white text-center space-y-3 group hover:border-blue-300 transition">
                <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <Truck className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                <div className="h-3 w-full bg-slate-100 mx-auto rounded" />
                <div className="h-3 w-5/6 bg-slate-100 mx-auto rounded" />
                <div className="pt-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Service Offering 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. The Iconic "Magic Section": Form to Sheet */}
        <section className="py-14 sm:py-16 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                The Automated Inquiry System
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                From Your Website Directly To Your Phone &amp; Sheet
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Try entering your name below and click &quot;Send Enquiry&quot;. Watch how the lead syncs to the sheet instantly!
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
              {/* Left Box: The Form (Website Side) */}
              <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4">
                <span className="label-tag -left-2 top-[-15px] bg-green-600 text-white font-bold text-[10px]">
                  On Your Website
                </span>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-800">Customer Inquiry Form</span>
                  <button
                    type="button"
                    onClick={handleAutoFillDemo}
                    className="text-[10px] text-blue-600 underline font-semibold hover:text-blue-800"
                  >
                    Auto-fill Sample
                  </button>
                </div>

                <form onSubmit={handleSendEnquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full border border-slate-300 rounded-lg px-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 w-full border border-slate-300 rounded-lg px-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Requirement / Message..."
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={syncing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {syncing ? 'Syncing to Sheet...' : 'Send Enquiry'}
                  </button>
                </form>
              </div>

              {/* Middle: Connection Arrow Beam */}
              <div className="flex flex-col items-center shrink-0">
                <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
                <div className="p-2.5 rounded-full bg-slate-800 text-green-400 border border-green-500/40 my-2 shadow-lg">
                  <ArrowRight className="w-5 h-5 md:rotate-0 rotate-90" />
                </div>
                <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest">
                  INSTANT DATA SYNC
                </span>
                {syncCount > 0 && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1">
                    {syncCount} Live Synced!
                  </span>
                )}
              </div>

              {/* Right Box: The Sheet (Client Side / Phone) */}
              <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-2xl p-2.5 shadow-2xl transform hover:scale-[1.02] transition">
                <span className="label-tag -right-2 left-auto top-[-15px] bg-green-600 text-white font-bold text-[10px]">
                  On Your Phone / Sheet
                </span>

                {/* Excel Grid UI */}
                <div className="bg-green-50/70 rounded-xl border border-green-200 p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-green-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-slate-800 text-xs">Leads_Sheet.xlsx</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Live Realtime
                    </span>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold text-slate-700 uppercase bg-green-200/80 p-1.5 rounded">
                    <div>Name</div>
                    <div>Phone</div>
                    <div className="text-right">Time</div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-1">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`grid grid-cols-3 gap-1 text-[10px] font-mono p-1.5 rounded border transition-all ${
                          lead.isNew
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold animate-pulse'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="truncate">{lead.name}</div>
                        <div className="truncate text-slate-500">{lead.phone}</div>
                        <div className="text-right text-emerald-700 font-semibold">{lead.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Footer Blueprint */}
        <footer className="bg-slate-800 text-white p-6 sm:p-10 border-t-4 border-blue-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Column 1 */}
            <div className="placeholder-box border-slate-600 bg-slate-700/50 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                Column 1: Company Trust
              </span>
              <p className="font-bold text-sm text-white">[Your Company Name]</p>
              <p className="text-slate-400 leading-relaxed">
                A short footer description about your business experience, quality guarantee, and local trust.
              </p>
            </div>

            {/* Column 2 */}
            <div className="placeholder-box border-slate-600 bg-slate-700/50 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                Column 2: Direct Contact
              </span>
              <p className="font-bold text-sm text-white">Contact &amp; Timings</p>
              <div className="h-3 w-28 bg-slate-600 rounded" />
              <div className="h-3 w-40 bg-slate-600 rounded" />
              <div className="h-3 w-20 bg-slate-600 rounded" />
            </div>

            {/* Column 3 */}
            <div className="placeholder-box border-slate-600 bg-slate-700/50 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                Column 3: Local GEO Map
              </span>
              <p className="font-bold text-sm text-white">Find Us On Google Maps</p>
              <div className="h-16 bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-[11px]">Google Map Integration</span>
              </div>
            </div>
          </div>
        </footer>

        {/* 6. Sticky Mobile Action Bar Notice */}
        <div className="bg-blue-50 border-t border-blue-200 p-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-900">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Docked Mobile Action Bar Included (WhatsApp + Call)</span>
          </div>
          <p className="text-[11px] text-blue-700">
            *On smartphones, docked WhatsApp and Call buttons remain permanently accessible at the bottom of customer screens for 3x higher inquiries.
          </p>
        </div>
      </div>
    </section>
  );
}
