'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  Users,
  Building2,
  FileSpreadsheet,
  RefreshCw,
  Ban,
  Filter,
  Globe,
  Server,
  ArrowLeft,
  Edit,
  Trash2,
  PlusCircle,
} from 'lucide-react';

interface AdminBusiness {
  id: string;
  name: string;
  slug: string;
  category: string;
  phone: string;
  city: string;
  state: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
  _count: {
    services: number;
    leads: number;
    faqs: number;
  };
}

interface AdminCounts {
  total: number;
  approved: number;
  rejected: number;
  suspended: number;
  pending: number;
  totalLeads: number;
  totalUsers: number;
}

interface DomainRequestItem {
  id: string;
  email: string;
  phone: string;
  domainType: string;
  domainName: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function SuperAdminPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'businesses' | 'domains'>('businesses');
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [domainRequests, setDomainRequests] = useState<DomainRequestItem[]>([]);
  const [counts, setCounts] = useState<AdminCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actingId, setActingId] = useState<string | null>(null);

  // Rejection modal state
  const [rejectModalBiz, setRejectModalBiz] = useState<AdminBusiness | null>(null);
  const [rejectReason, setRejectReason] = useState('Does not comply with verified local business criteria.');

  const fetchAdminData = () => {
    setLoading(true);
    setAccessDenied(false);
    const query = new URLSearchParams();
    if (statusFilter !== 'ALL') query.set('status', statusFilter);
    if (search.trim()) query.set('search', search.trim());

    fetch(`/api/admin/businesses?${query.toString()}`)
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          setAccessDenied(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setBusinesses(data.data.businesses || []);
          setCounts(data.data.counts || null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Also fetch domain requests
    fetch('/api/domains')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data?.requests) {
          setDomainRequests(data.data.requests);
        }
      })
      .catch(() => {});
  };

  const handleDeleteBusiness = async (id: string, name: string) => {
    if (!confirm(`Super Admin Action: Permanently delete "${name}" and all its leads/data?`)) return;
    try {
      const res = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert('Failed to delete business profile');
      }
    } catch {
      alert('Error deleting business profile');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleUpdateStatus = async (bizId: string, status: 'APPROVED' | 'SUSPENDED') => {
    setActingId(bizId);
    try {
      const res = await fetch(`/api/admin/businesses/${bizId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b.id === bizId ? { ...b, status, rejectionReason: null } : b))
        );
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalBiz) return;
    setActingId(rejectModalBiz.id);
    try {
      const res = await fetch(`/api/admin/businesses/${rejectModalBiz.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === rejectModalBiz.id ? { ...b, status: 'REJECTED', rejectionReason: rejectReason } : b
          )
        );
        setRejectModalBiz(null);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500 text-slate-950 font-black">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight">Super Admin Moderation Control</h1>
              </div>
              <p className="text-xs text-slate-400">
                You hold master moderation authority. All businesses are published by default (&quot;sab approve rahega&quot;),
                and you can review, reject, or suspend any listing at any time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New Storefront
              </Link>
              <Link
                href="/dashboard"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={fetchAdminData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sync List
              </button>
            </div>
          </div>
        </div>
      </div>

      {accessDenied ? (
        <div className="max-w-md mx-auto my-16 bg-white border border-amber-200 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Super Admin Authentication Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This control center is reserved for Super Admins. Please log in with your authorized Super Admin email to manage all platform businesses and moderations.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md transition"
            >
              Log In as Super Admin
            </Link>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Metric Cards */}
        {counts && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Businesses</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{counts.total}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Live (Approved)</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{counts.approved}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-red-600 uppercase">Rejected</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{counts.rejected}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Suspended</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{counts.suspended}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Total Leads</p>
              <p className="text-xl font-black text-blue-600 mt-0.5">{counts.totalLeads}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-purple-600 uppercase">Domain Requests</p>
              <p className="text-xl font-black text-purple-600 mt-0.5">{domainRequests.length}</p>
            </div>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-3">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'businesses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Storefront Moderation ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'domains'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Custom Domain Requests ({domainRequests.length})
          </button>
        </div>

        {activeTab === 'businesses' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search by business, email, city, slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </form>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Moderation Filter:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved Only</option>
                  <option value="REJECTED">Rejected Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                  <option value="PENDING">Pending Only</option>
                </select>
              </div>
            </div>

            {/* Businesses Moderation Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                  <div className="w-6 h-6 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p>Loading master records...</p>
                </div>
              ) : businesses.length === 0 ? (
                <div className="p-12 text-center space-y-2 text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700">No businesses match the current filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Business</th>
                        <th className="px-4 py-3">Owner Account</th>
                        <th className="px-4 py-3">Location &amp; Phone</th>
                        <th className="px-4 py-3 text-center">Offerings / Leads</th>
                        <th className="px-4 py-3">Moderation Status</th>
                        <th className="px-4 py-3 text-right">Super Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {businesses.map((biz) => {
                        const isApproved = biz.status === 'APPROVED';
                        const isRejected = biz.status === 'REJECTED';
                        const isSuspended = biz.status === 'SUSPENDED';

                        return (
                          <tr key={biz.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-4 py-3.5">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 block">{biz.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-blue-600 font-mono">/biz/{biz.slug}</span>
                                  <Link
                                    href={`/biz/${biz.slug}`}
                                    target="_blank"
                                    className="text-slate-400 hover:text-blue-600"
                                    title="Open Live Storefront"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>
                                <span className="text-[10px] text-slate-400">{biz.category}</span>
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-mono text-slate-800 block">{biz.user.email}</span>
                              <span className="text-[10px] text-slate-400">
                                Registered {new Date(biz.createdAt).toLocaleDateString('en-IN')}
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-medium text-slate-800 block">
                                {biz.city}, {biz.state}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">{biz.phone}</span>
                            </td>

                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold mr-1">
                                {biz._count.services} svcs
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                                {biz._count.leads} leads
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Approved
                                </span>
                              )}
                              {isRejected && (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                                    <XCircle className="w-3 h-3" /> Rejected
                                  </span>
                                  {biz.rejectionReason && (
                                    <p className="text-[10px] text-red-700 italic max-w-xs line-clamp-1">
                                      {biz.rejectionReason}
                                    </p>
                                  )}
                                </div>
                              )}
                              {isSuspended && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <Ban className="w-3 h-3" /> Suspended
                                </span>
                              )}
                              {biz.status === 'PENDING' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Direct CRUD Links */}
                                <Link
                                  href={`/dashboard/businesses/${biz.id}/edit`}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition"
                                  title="Edit Business Profile & Google Sheet"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Link>

                                <Link
                                  href={`/dashboard/businesses/${biz.id}/leads`}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 rounded hover:bg-slate-100 transition"
                                  title="View Leads & Inquiries"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                </Link>

                                {!isApproved && (
                                  <button
                                    disabled={actingId === biz.id}
                                    onClick={() => handleUpdateStatus(biz.id, 'APPROVED')}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                )}

                                {!isRejected && (
                                  <button
                                    disabled={actingId === biz.id}
                                    onClick={() => {
                                      setRejectModalBiz(biz);
                                      setRejectReason('Violates business verification & authenticity guidelines.');
                                    }}
                                    className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-[11px] transition disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                )}

                                {!isSuspended && (
                                  <button
                                    disabled={actingId === biz.id}
                                    onClick={() => handleUpdateStatus(biz.id, 'SUSPENDED')}
                                    className="px-2 py-1 rounded text-slate-500 hover:text-amber-700 hover:bg-amber-50 text-[11px] transition disabled:opacity-50"
                                    title="Suspend Temporarily"
                                  >
                                    Suspend
                                  </button>
                                )}

                                <button
                                  disabled={actingId === biz.id}
                                  onClick={() => handleDeleteBusiness(biz.id, biz.name)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                                  title="Permanently Delete Business"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
        )}

        {/* DOMAIN REQUESTS SECTION */}
        {activeTab === 'domains' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Submitted Domain &amp; Subdomain Connection Requests</h3>
                <p className="text-xs text-slate-500">
                  Requests submitted by users via the <code className="text-blue-600">/domains</code> page.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">
                {domainRequests.length} Total Requests
              </span>
            </div>

            {domainRequests.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                <Globe className="w-8 h-8 mx-auto text-slate-300" />
                <p>No domain connection requests submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Domain Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Applicant Email &amp; Phone</th>
                      <th className="px-4 py-3">DNS Registrar / Notes</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {domainRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-bold font-mono text-blue-700">
                          {req.domainName}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.domainType === 'CUSTOM_DOMAIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {req.domainType === 'CUSTOM_DOMAIN' ? 'Custom Domain' : 'Subdomain'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-900 block">{req.email}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{req.phone}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">
                          {req.notes || 'No registrar specified'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(req.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Rejection Dialog Modal */}
      {rejectModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Business Listing</h3>
                <p className="text-xs text-slate-500">{rejectModalBiz.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting this listing will immediately take down its public storefront at{' '}
              <code className="text-blue-600">/biz/{rejectModalBiz.slug}</code> and notify the owner inside their dashboard.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Rejection Reason</label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this listing is being rejected..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalBiz(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
