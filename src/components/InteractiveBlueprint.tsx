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
  MapPin,
  Send,
  Laptop,
  Tablet,
  Smartphone,
  Menu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SheetLead {
  id: string;
  name: string;
  phone: string;
  time: string;
  isNew?: boolean;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function InteractiveBlueprint() {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncCount, setSyncCount] = useState(0);

  const [leads, setLeads] = useState<SheetLead[]>([
    { id: '1', name: 'Rohan K.', phone: '9812...', time: 'Just Now' },
    { id: '2', name: 'Amit S.', phone: '8800...', time: '1 hr ago' },
    { id: '3', name: 'Priya M.', phone: '9923...', time: '3 hrs ago' },
  ]);

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSyncing(true);

    setTimeout(() => {
      const newLead: SheetLead = {
        id: String(Date.now()),
        name: name.trim(),
        phone: phone.trim().slice(0, 4) + '...',
        time: 'Just Now',
        isNew: true,
      };

      setLeads((prev) => [newLead, ...prev.slice(0, 4)]);
      setSyncCount((c) => c + 1);
      setName('');
      setPhone('');
      setRequirement('');
      setSyncing(false);
    }, 350);
  };

  const handleAutoFillDemo = () => {
    const demoNames = ['Vikram Malhotra', 'Sneha Patel', 'Rajesh Gupta', 'Ananya Deshmukh'];
    const demoPhones = ['98201 44552', '91520 88910', '98900 12345', '97654 32100'];
    const demoReqs = ['Need quote for urgent service', 'Commercial inquiry for shop visit', 'Interested in annual package'];

    const randomIdx = Math.floor(Math.random() * demoNames.length);
    setName(demoNames[randomIdx]);
    setPhone(demoPhones[randomIdx]);
    setRequirement(demoReqs[randomIdx % demoReqs.length]);
  };

  return (
    <section id="blueprint" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* 1. Device Preview Switcher & Mode Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blueprint-500 animate-pulse" />
            <span className="font-bold text-sm text-slate-100">Live Device Preview</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            {device === 'desktop' && 'Laptop / Desktop (100% Full View)'}
            {device === 'tablet' && 'Tablet View (768px iPad)'}
            {device === 'mobile' && 'Mobile View (390px iPhone)'}
          </span>
        </div>

        {/* Device Switcher Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === 'desktop'
                ? 'bg-blueprint-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === 'tablet'
                ? 'bg-blueprint-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === 'mobile'
                ? 'bg-blueprint-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (390px)</span>
          </button>
        </div>

        {/* Live Storefront Link */}
        <Link
          href="/biz/samplebyesitesz"
          target="_blank"
          className="text-xs font-bold text-blueprint-400 hover:text-blueprint-300 flex items-center gap-1.5 transition shrink-0"
        >
          <span>Open Full Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Device Container Wrapper */}
      <div className="flex justify-center transition-all duration-300 ease-in-out">
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            device === 'desktop'
              ? 'max-w-5xl'
              : device === 'tablet'
              ? 'max-w-[768px] ring-8 ring-slate-800 rounded-[32px] p-2 bg-slate-900 shadow-2xl'
              : 'max-w-[390px] ring-8 ring-slate-800 rounded-[44px] p-3 bg-slate-900 shadow-2xl'
          }`}
        >
          {/* Simulated Mobile Island Notch for Mobile View */}
          {device === 'mobile' && (
            <div className="flex justify-center pb-2">
              <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-950 inline-block mr-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-950 inline-block" />
              </div>
            </div>
          )}

          {/* Blueprint Browser Canvas */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden relative">
            {/* Top Browser Bar */}
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="ml-2 text-slate-300 text-[11px] truncate">
                  samplebyesitesz.esitesz.com
                </span>
              </div>
              <span className="text-blueprint-400 font-bold uppercase text-[10px] tracking-wider hidden sm:inline">
                Blueprint Architecture
              </span>
            </div>

            {/* Original Agency Banner */}
            <div className="bg-slate-900 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium border-t border-slate-800">
              <span className="opacity-75">Demonstration Mode:</span> Show this to clients to visualize their data.
            </div>

            {/* Header Section */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center h-14 sm:h-16">
                  {/* Logo Placeholder */}
                  <div className="relative group">
                    <div className="h-11 sm:h-12 w-36 sm:w-40 placeholder-box rounded-lg flex items-center justify-center">
                      <span className="text-blueprint-600 font-bold text-xs sm:text-sm border-2 border-blueprint-600 px-2 py-1 border-dashed rounded">
                        YOUR LOGO
                      </span>
                    </div>
                    <span className="label-tag">We upload your logo</span>
                  </div>

                  {/* Contact Placeholder (Shown on Desktop/Tablet) */}
                  <div className={`${device === 'mobile' ? 'hidden' : 'flex'} items-center gap-4`}>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Call Us</div>
                      <div className="text-sm sm:text-base font-bold text-slate-800 bg-yellow-100 px-2 rounded">
                        +91 XXXXX XXXXX
                      </div>
                    </div>
                    <div className="h-10 w-28 sm:w-32 placeholder-box rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blueprint-600">CTA Button</span>
                    </div>
                  </div>

                  {/* Mobile Menu Icon (Shown on Mobile View) */}
                  <div className={`${device === 'mobile' ? 'block' : 'hidden md:hidden'} text-xl text-slate-400`}>
                    <Menu className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </nav>

            {/* Hero Section */}
            <section className="py-8 sm:py-14 px-4 sm:px-6 relative overflow-hidden bg-slate-50/60">
              <div
                className={`max-w-5xl mx-auto grid gap-8 sm:gap-10 items-center ${
                  device === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'
                }`}
              >
                {/* Text Content Placeholder */}
                <div className="relative space-y-5">
                  {/* Handwritten Red Instruction Arrow */}
                  <div className="hidden lg:flex items-center gap-1.5 instruction-arrow text-red-500 font-bold text-xs absolute -top-7 left-2">
                    <span>We write your main offer here</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>

                  <div className="placeholder-box p-4 sm:p-6 rounded-xl relative border-none bg-transparent">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-300 uppercase leading-tight">
                      YOUR MAIN <br />
                      <span className="text-blueprint-500">HEADLINE HERE</span>
                    </h1>
                  </div>

                  <div className="placeholder-box p-4 rounded-lg bg-slate-100 border-none">
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      We will write a short description about your business, what you sell, and why customers should choose you.
                    </p>
                  </div>

                  <div className="flex gap-3 sm:gap-4 pt-2">
                    <div className="h-11 sm:h-12 flex-1 sm:flex-initial sm:w-40 bg-green-500 rounded-lg flex items-center justify-center shadow-lg text-white font-bold gap-2 opacity-90 hover:opacity-100 transition text-xs sm:text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </div>
                    <div className="h-11 sm:h-12 flex-1 sm:flex-initial sm:w-40 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg text-white font-bold gap-2 opacity-90 hover:opacity-100 transition text-xs sm:text-sm">
                      <Phone className="w-4 h-4" />
                      <span>Call Now</span>
                    </div>
                  </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="relative h-60 sm:h-72 md:h-84 w-full placeholder-box rounded-2xl flex flex-col items-center justify-center text-center p-6">
                  <span className="label-tag right-auto left-1/2 transform -translate-x-1/2">
                    Your Hero Image
                  </span>
                  <ImageIcon className="w-14 h-14 text-blueprint-300 mb-3" />
                  <p className="text-blueprint-600 font-bold text-sm sm:text-base">Your Main Shop/Service Photo</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xs">
                    Send us a photo of your shop front, your best product, or yourself.
                  </p>
                </div>
              </div>
            </section>

            {/* Services / Features Section */}
            <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <span className="bg-blueprint-100 text-blueprint-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Your Services
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                    What do you offer?
                  </h2>
                </div>

                <div
                  className={`grid gap-6 ${
                    device === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'
                  }`}
                >
                  {/* Service 1 */}
                  <div className="relative p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center space-y-3 group hover:border-blueprint-300 transition">
                    <div className="w-14 h-14 mx-auto bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                    <div className="h-3.5 w-full bg-slate-100 mx-auto rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-100 mx-auto rounded" />
                    <div className="absolute inset-0 placeholder-box rounded-2xl opacity-0 hover:opacity-100 flex items-center justify-center bg-white/95 transition-opacity">
                      <span className="text-blueprint-600 font-bold text-sm">Service 1</span>
                    </div>
                  </div>

                  {/* Service 2 */}
                  <div className="relative p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center space-y-3 group hover:border-blueprint-300 transition">
                    <div className="w-14 h-14 mx-auto bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <Wrench className="w-6 h-6 text-blueprint-500" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                    <div className="h-3.5 w-full bg-slate-100 mx-auto rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-100 mx-auto rounded" />
                    <div className="absolute inset-0 placeholder-box rounded-2xl opacity-0 hover:opacity-100 flex items-center justify-center bg-white/95 transition-opacity">
                      <span className="text-blueprint-600 font-bold text-sm">Service 2</span>
                    </div>
                  </div>

                  {/* Service 3 */}
                  <div className="relative p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center space-y-3 group hover:border-blueprint-300 transition">
                    <div className="w-14 h-14 mx-auto bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <Truck className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-200 mx-auto rounded" />
                    <div className="h-3.5 w-full bg-slate-100 mx-auto rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-100 mx-auto rounded" />
                    <div className="absolute inset-0 placeholder-box rounded-2xl opacity-0 hover:opacity-100 flex items-center justify-center bg-white/95 transition-opacity">
                      <span className="text-blueprint-600 font-bold text-sm">Service 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* The Magic Section: Form to Sheet Sync */}
            <section className="py-12 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-green-400 font-mono text-xs uppercase tracking-widest block font-bold">
                    The Magic Section
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    How You Get Customers
                  </h2>
                  <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
                    When someone visits your site, they fill this simple form. Watch what happens next:
                  </p>
                </div>

                <div
                  className={`flex items-center justify-center gap-6 ${
                    device === 'mobile' ? 'flex-col' : 'flex-col md:flex-row'
                  }`}
                >
                  {/* The Form (Website Side) */}
                  <div className="relative w-full max-w-sm bg-white text-slate-800 rounded-xl p-5 shadow-2xl space-y-3">
                    <span className="label-tag -left-2 top-[-15px] bg-green-600">
                      On Your Website
                    </span>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-700">Customer Inquiry Form</span>
                      <button
                        type="button"
                        onClick={handleAutoFillDemo}
                        className="text-[11px] text-blueprint-600 underline font-semibold hover:text-blueprint-800"
                      >
                        Auto-fill Sample
                      </button>
                    </div>

                    <form onSubmit={handleSendEnquiry} className="space-y-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Customer Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 w-full border border-slate-300 rounded px-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blueprint-500 bg-slate-50"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 w-full border border-slate-300 rounded px-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blueprint-500 bg-slate-50"
                      />
                      <textarea
                        rows={2}
                        placeholder="Requirement..."
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blueprint-500 bg-slate-50"
                      />
                      <button
                        type="submit"
                        disabled={syncing}
                        className="w-full bg-blueprint-600 hover:bg-blueprint-700 text-white py-2.5 rounded font-bold text-xs sm:text-sm shadow transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {syncing ? 'Syncing to Sheet...' : 'Send Enquiry'}
                      </button>
                    </form>
                  </div>

                  {/* Connection Arrow */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
                    <div className="p-2.5 rounded-full bg-slate-800 text-green-400 border border-green-500/40 my-2 shadow-lg">
                      <ArrowRight className={`w-5 h-5 ${device === 'mobile' ? 'rotate-90' : 'md:rotate-0 rotate-90'}`} />
                    </div>
                    <span className="text-[10px] font-mono text-green-400 font-bold uppercase tracking-wider">
                      INSTANT DATA SYNC
                    </span>
                    {syncCount > 0 && (
                      <span className="text-[10px] text-green-300 bg-green-950 px-2 py-0.5 rounded-full border border-green-500/30 mt-1">
                        {syncCount} Live Synced!
                      </span>
                    )}
                  </div>

                  {/* The Sheet (Client Side / Phone) */}
                  <div className="relative w-full max-w-sm bg-white rounded-lg p-1.5 shadow-2xl transform hover:scale-[1.02] transition">
                    <span className="label-tag -right-2 left-auto top-[-15px] bg-green-600">
                      On Your Phone
                    </span>

                    {/* Excel Grid UI */}
                    <div className="bg-green-50 rounded h-52 border border-green-200 p-2.5 overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 border-b border-green-200 pb-2">
                          <FileSpreadsheet className="w-5 h-5 text-green-700" />
                          <span className="font-bold text-slate-700 text-xs sm:text-sm">Leads_Sheet.xlsx</span>
                        </div>

                        {/* Column Titles */}
                        <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-700 mb-1">
                          <div className="bg-green-200 p-1 font-bold rounded">Name</div>
                          <div className="bg-green-200 p-1 font-bold rounded">Phone</div>
                          <div className="bg-green-200 p-1 font-bold rounded">Date</div>
                        </div>

                        {/* Rows */}
                        <div className="space-y-1">
                          {leads.map((lead) => (
                            <div
                              key={lead.id}
                              className={`grid grid-cols-3 gap-1 text-[10px] font-mono p-1 border rounded transition-all ${
                                lead.isNew
                                  ? 'bg-green-100 border-green-400 text-green-950 font-bold animate-pulse'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <div className="truncate">{lead.name}</div>
                              <div className="truncate text-slate-500">{lead.phone}</div>
                              <div className="text-right text-green-700 font-semibold">{lead.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-green-800 font-mono text-center pt-1 border-t border-green-200/60">
                        *Leads append automatically in real-time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Blueprint (Matching samplebyesitesz 1:1) */}
            <footer className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-blueprint-500">
              <div
                className={`max-w-5xl mx-auto grid gap-8 ${
                  device === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'
                }`}
              >
                {/* Column 1 */}
                <div className="placeholder-box footer-box border-slate-600 bg-slate-700/50 p-4 rounded-lg">
                  <span className="text-xs text-blueprint-300 font-bold uppercase mb-2 block">
                    Column 1
                  </span>
                  <p className="font-bold text-lg mb-2 text-white">[Your Company Name]</p>
                  <p className="text-sm text-slate-400">
                    A short footer description about your business trust and values.
                  </p>
                </div>

                {/* Column 2 */}
                <div className="placeholder-box footer-box border-slate-600 bg-slate-700/50 p-4 rounded-lg">
                  <span className="text-xs text-blueprint-300 font-bold uppercase mb-2 block">
                    Column 2
                  </span>
                  <p className="font-bold text-base mb-2 text-white">Contact Us</p>
                  <div className="h-4 w-32 bg-slate-600 rounded mb-2" />
                  <div className="h-4 w-48 bg-slate-600 rounded mb-2" />
                  <div className="h-4 w-24 bg-slate-600 rounded" />
                </div>

                {/* Column 3 */}
                <div className="placeholder-box footer-box border-slate-600 bg-slate-700/50 p-4 rounded-lg">
                  <span className="text-xs text-blueprint-300 font-bold uppercase mb-2 block">
                    Column 3
                  </span>
                  <p className="font-bold text-base mb-2 text-white">Find Us</p>
                  <div className="aspect-video bg-slate-600 rounded flex items-center justify-center text-slate-300 text-xs">
                    Google Map Integration
                  </div>
                </div>
              </div>
            </footer>

            {/* Sticky Mobile Placeholder (Matching samplebyesitesz) */}
            <div
              className={`bg-white border-t border-slate-200 z-50 p-2 ${
                device === 'mobile' ? 'block' : 'md:hidden'
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="placeholder-box bg-green-50 border-green-300 h-12 rounded flex items-center justify-center text-green-700 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>WhatsApp</span>
                </div>
                <div className="placeholder-box bg-blue-50 border-blue-300 h-12 rounded flex items-center justify-center text-blue-700 font-bold text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Call Now</span>
                </div>
              </div>
              <div className="text-center text-[10px] text-slate-400 mt-1">
                *This bar stays fixed on customer&apos;s phone screen
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
