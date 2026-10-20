'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Search,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  requirement: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'DISMISSED';
  createdAt: string;
}

export default function BusinessLeadsPage({ params }: { params: { id: string } }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (statusFilter !== 'ALL') query.set('status', statusFilter);
    if (search.trim()) query.set('search', search.trim());

    fetch(`/api/businesses/${params.id}/leads?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.data.leads || []);
          if (data.data.businessName) setBusinessName(data.data.businessName);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [params.id, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch(`/api/businesses/${params.id}/leads`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as Lead['status'] } : l))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Inquiry Leads &amp; Instant Data Sync
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800 border border-green-200">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Capturing incoming customer requests from <span className="font-semibold text-slate-700">{businessName || 'your storefront'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <a
            href={`/api/businesses/${params.id}/leads/export`}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Excel / CSV
          </a>
        </div>
      </div>

      {/* Reference Blueprint Sync Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-green-400 font-bold">
              ● Automated Real-time Inquiry Sync Engine
            </span>
            <h2 className="text-sm font-bold">From Your Website Directly To Your Leads Sheet</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Every customer who enters their name, phone number, and requirement on your landing page is
              instantly recorded here. You can download this into Excel or connect directly with Google Sheets.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-green-400">{leads.length}</span>
            <span className="block text-[10px] text-slate-400 uppercase font-mono">Total Recorded Leads</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Inquiries</option>
            <option value="NEW">New (Unread)</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <div className="w-6 h-6 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p>Syncing inquiries...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No leads recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Share your business URL with customers or test the inquiry form on your live page to watch leads appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone &amp; Direct Actions</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Received At</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                  const waUrl = `https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                    lead.name
                  )},%20thank%20you%20for%20contacting%20us%20on%20esitesz!`;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        {lead.name}
                        {lead.email && <span className="block text-[11px] font-normal text-slate-500">{lead.email}</span>}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{lead.phone}</span>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                            title="Call Now"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="line-clamp-2 text-slate-700">{lead.requirement}</p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(lead.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          disabled={updatingId === lead.id}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-2 py-1 text-[11px] font-bold rounded border ${
                            lead.status === 'NEW'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.status === 'CONTACTED'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : lead.status === 'CONVERTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="DISMISSED">DISMISSED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
