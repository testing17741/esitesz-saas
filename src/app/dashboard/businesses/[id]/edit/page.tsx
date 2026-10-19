'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Globe,
  MapPin,
  HelpCircle,
  Briefcase,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  badge: string | null;
  order: number;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  headline: string | null;
  description: string | null;
  category: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  themeColor: string;
  status: string;
  rejectionReason: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  ctaText: string;
  whatsappMessage: string;
  openingHours: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  services: ServiceItem[];
  faqs: FaqItem[];
}

export default function EditBusinessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'services' | 'faqs' | 'seo'>('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Service State
  const [newService, setNewService] = useState({ title: '', price: '', badge: '', description: '' });
  // New FAQ State
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetch(`/api/businesses/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.business) {
          setBusiness(data.data.business);
        } else {
          setFeedback({ type: 'error', message: data.error || 'Failed to load business' });
        }
      })
      .catch(() => setFeedback({ type: 'error', message: 'Network error loading profile' }))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSaveMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/businesses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update business');
      }

      setFeedback({ type: 'success', message: 'Business profile successfully updated & synced!' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim()) return;

    try {
      const res = await fetch(`/api/businesses/${params.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          order: (business?.services.length || 0) + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.service) {
        setBusiness((prev) => prev ? { ...prev, services: [...prev.services, data.data.service] } : null);
        setNewService({ title: '', price: '', badge: '', description: '' });
        setFeedback({ type: 'success', message: 'Service added successfully' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to add service' });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/businesses/${params.id}/services?serviceId=${serviceId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBusiness((prev) =>
          prev ? { ...prev, services: prev.services.filter((s) => s.id !== serviceId) } : null
        );
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete service' });
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    try {
      const res = await fetch(`/api/businesses/${params.id}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newFaq,
          order: (business?.faqs.length || 0) + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.faq) {
        setBusiness((prev) => prev ? { ...prev, faqs: [...prev.faqs, data.data.faq] } : null);
        setNewFaq({ question: '', answer: '' });
        setFeedback({ type: 'success', message: 'FAQ added for AI Answer Engine optimization!' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to add FAQ' });
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/businesses/${params.id}/faqs?faqId=${faqId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBusiness((prev) =>
          prev ? { ...prev, faqs: prev.faqs.filter((f) => f.id !== faqId) } : null
        );
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete FAQ' });
    }
  };

  const handleDeleteBusiness = async () => {
    if (!confirm(`Are you certain you want to permanently delete "${business?.name}"? All leads and data will be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/businesses/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      alert('Failed to delete business profile');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Loading business profile...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-red-600 font-semibold">Business not found or access denied.</p>
        <Link href="/dashboard" className="text-xs text-blue-600 underline mt-2 block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-white border border-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{business.name}</h1>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                business.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                business.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {business.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live link: <code className="text-blue-600 font-mono">/biz/{business.slug}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/businesses/${business.id}/leads`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Inquiry Leads Sync
          </Link>

          {business.status === 'APPROVED' && (
            <Link
              href={`/biz/${business.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Storefront
            </Link>
          )}
        </div>
      </div>

      {/* Moderation Rejection Alert if rejected */}
      {business.status === 'REJECTED' && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            This storefront was rejected by the Super Admin:
          </p>
          <p className="pl-5 text-red-800">{business.rejectionReason || 'Violates quality standards.'}</p>
          <p className="pl-5 text-slate-600 pt-1">
            You may edit your business details below to address the issue. Once updated, it will be reconsidered.
          </p>
        </div>
      )}

      {/* Feedback Banner */}
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Core Details & Contact
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Services ({business.services.length})
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'faqs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> FAQs & AEO ({business.faqs.length})
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> SEO & GEO Settings
        </button>
      </div>

      {/* TAB 1: CORE DETAILS */}
      {activeTab === 'details' && (
        <form onSubmit={handleSaveMain} className="bg-white border border-slate-200 rounded-b-xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Business Name</label>
              <input
                type="text"
                required
                value={business.name}
                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">URL Slug</label>
              <input
                type="text"
                required
                value={business.slug}
                onChange={(e) => setBusiness({ ...business, slug: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">Hero Headline</label>
              <input
                type="text"
                value={business.headline || ''}
                placeholder="e.g. YOUR MAIN HEADLINE HERE / Trusted Electrical Works in Pune"
                onChange={(e) => setBusiness({ ...business, headline: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">About / Value Proposition Description</label>
              <textarea
                rows={3}
                value={business.description || ''}
                placeholder="Short description about your business, what you sell, and why customers should choose you."
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Phone for Direct Calls</label>
              <input
                type="text"
                value={business.phone}
                onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">WhatsApp Number</label>
              <input
                type="text"
                value={business.whatsapp}
                onChange={(e) => setBusiness({ ...business, whatsapp: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">WhatsApp Pre-filled Message</label>
              <input
                type="text"
                value={business.whatsappMessage || ''}
                onChange={(e) => setBusiness({ ...business, whatsappMessage: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Logo Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={business.logoUrl || ''}
                onChange={(e) => setBusiness({ ...business, logoUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Hero Shop / Service Photo URL</label>
              <input
                type="url"
                placeholder="https://example.com/shop.jpg"
                value={business.heroImageUrl || ''}
                onChange={(e) => setBusiness({ ...business, heroImageUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Theme Color Token</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={business.themeColor}
                  onChange={(e) => setBusiness({ ...business, themeColor: e.target.value })}
                  className="w-9 h-9 rounded cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={business.themeColor}
                  onChange={(e) => setBusiness({ ...business, themeColor: e.target.value })}
                  className="w-28 px-2 py-1.5 text-xs font-mono rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Business Hours</label>
              <input
                type="text"
                value={business.openingHours || ''}
                placeholder="Mon - Sat: 9:00 AM - 8:00 PM, Sun: Closed"
                onChange={(e) => setBusiness({ ...business, openingHours: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDeleteBusiness}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete Business
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save & Sync Details'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SERVICES OFFERED */}
      {activeTab === 'services' && (
        <div className="bg-white border border-slate-200 rounded-b-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Services & Offerings</h2>
            <p className="text-xs text-slate-500">
              Showcase what your business offers. Each item appears prominently on your storefront card grid.
            </p>
          </div>

          {/* Add Service Form */}
          <form onSubmit={handleAddService} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add New Service</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Service Title (e.g. AC Installation)"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Price (e.g. ₹499 or Free Estimate)"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Badge (e.g. Popular, Fast)"
                value={newService.badge}
                onChange={(e) => setNewService({ ...newService, badge: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Brief description of what is included in this service..."
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Service Card
            </button>
          </form>

          {/* Service Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {business.services.map((srv) => (
              <div key={srv.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{srv.title}</h3>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {srv.badge && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {srv.badge}
                  </span>
                )}
                {srv.price && <p className="text-xs font-semibold text-emerald-700">{srv.price}</p>}
                <p className="text-xs text-slate-600 line-clamp-2">{srv.description || 'No description added.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQS & AEO (ANSWER ENGINE OPTIMIZATION) */}
      {activeTab === 'faqs' && (
        <div className="bg-white border border-slate-200 rounded-b-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">AEO (Answer Engine Optimization) & FAQs</h2>
            <p className="text-xs text-slate-500">
              These Q&amp;As are structured into schema.org FAQPage JSON-LD. AI search engines (ChatGPT Search, Perplexity, Gemini, Google SGE)
              cite these direct answers when users search for your local services.
            </p>
          </div>

          {/* Add FAQ Form */}
          <form onSubmit={handleAddFaq} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add Structured FAQ</p>
            <input
              type="text"
              required
              placeholder="Question (e.g. Do you offer on-site warranty service?)"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <textarea
              rows={2}
              required
              placeholder="Direct answer formatted clearly for AI answers..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Save FAQ
            </button>
          </form>

          {/* FAQs List */}
          <div className="space-y-3">
            {business.faqs.map((faq) => (
              <div key={faq.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-slate-900">Q: {faq.question}</h3>
                  <p className="text-xs text-slate-600">A: {faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SEO & GEO */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveMain} className="bg-white border border-slate-200 rounded-b-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">GEO & Local Map Ranking</h2>
              <p className="text-xs text-slate-500">
                Helps Google Maps and AI search bots pinpoint your exact physical location in India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  value={business.city}
                  onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">State</label>
                <input
                  type="text"
                  value={business.state}
                  onChange={(e) => setBusiness({ ...business, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Pincode</label>
                <input
                  type="text"
                  value={business.pincode}
                  onChange={(e) => setBusiness({ ...business, pincode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Full Physical Address</label>
              <input
                type="text"
                value={business.address}
                onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Google Maps Embed / Direct Link</label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={business.googleMapsUrl || ''}
                onChange={(e) => setBusiness({ ...business, googleMapsUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Meta Tags & Search Preview</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Custom Meta Title</label>
                  <input
                    type="text"
                    value={business.metaTitle || ''}
                    placeholder={`${business.name} | ${business.category} in ${business.city}`}
                    onChange={(e) => setBusiness({ ...business, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Meta Description</label>
                  <textarea
                    rows={2}
                    value={business.metaDescription || ''}
                    placeholder={`Official page for ${business.name}. Contact ${business.phone} for quotes.`}
                    onChange={(e) => setBusiness({ ...business, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={business.keywords || ''}
                    placeholder={`${business.name}, ${business.city} services, best ${business.category}`}
                    onChange={(e) => setBusiness({ ...business, keywords: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Google Search Snippet Preview Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Snippet Preview</p>
              <p className="text-blue-700 font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                {business.metaTitle || `${business.name} | ${business.category} in ${business.city}`}
              </p>
              <p className="text-[11px] text-emerald-700 font-mono">
                https://esitesz.com/biz/{business.slug}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2">
                {business.metaDescription || `Official business showcase for ${business.name} in ${business.city}. Call ${business.phone} for quotes.`}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save SEO & GEO'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
