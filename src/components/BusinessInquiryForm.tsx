'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface BusinessInquiryFormProps {
  businessId: string;
  businessName: string;
  ctaText?: string;
}

export function BusinessInquiryForm({ businessId, businessName, ctaText = 'Send Inquiry' }: BusinessInquiryFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', requirement: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          requirement: form.requirement,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', requirement: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200">
      <span className="absolute -top-3 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
        Instant Direct Inquiry
      </span>

      {submitted ? (
        <div className="py-8 text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Inquiry Dispatched!</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your details have been delivered directly to <span className="font-semibold text-slate-900">{businessName}</span>.
            Their team will contact you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-blue-600 font-semibold underline hover:text-blue-700 pt-2 block mx-auto"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Request a Free Callback / Quote</h3>
            <p className="text-xs text-slate-500">Fast response directly from the business.</p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase text-slate-600">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase text-slate-600">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98200 12345"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase text-slate-600">Your Requirement *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe your service requirement, location, or questions..."
              value={form.requirement}
              onChange={(e) => setForm({ ...form, requirement: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Transmitting inquiry...' : ctaText}
            <Send className="w-3.5 h-3.5" />
          </button>

          <p className="text-[10px] text-center text-slate-400">
            🔒 Protected by esitesz data sync. Your details are private.
          </p>
        </form>
      )}
    </div>
  );
}
