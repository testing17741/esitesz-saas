import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
  Building2,
  ExternalLink,
  Edit,
  FileSpreadsheet,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Phone,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  const businesses = await prisma.business.findMany({
    where: isSuperAdmin ? undefined : { userId: user.id },
    include: {
      user: { select: { email: true } },
      _count: {
        select: {
          services: true,
          leads: true,
          faqs: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      {/* Super Admin Access Banner */}
      {isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Super Admin Full Access Active — Viewing all platform storefronts with full CRUD & moderation privileges.</span>
          </div>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
          >
            Open Moderation Center
          </Link>
        </div>
      )}
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Businesses</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads Received</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {businesses.reduce((acc, b) => acc + b._count.leads, 0)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Offerings</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {businesses.reduce((acc, b) => acc + b._count.services, 0)}
          </p>
        </div>
      </div>

      {/* Business Listing */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Registered Business Storefronts</h2>
          <span className="text-xs text-slate-500">{businesses.length} total</span>
        </div>

        {businesses.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No businesses yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first digital business storefront with instant WhatsApp inquiries, AEO optimization, and Google Maps GEO ranking.
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Create Business Storefront
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {businesses.map((biz) => {
              const isApproved = biz.status === 'APPROVED';
              const isRejected = biz.status === 'REJECTED';
              const isSuspended = biz.status === 'SUSPENDED';

              return (
                <div key={biz.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{biz.name}</h3>

                        {/* Status Badge */}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Live & Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-3 h-3" /> Rejected by Admin
                          </span>
                        )}
                        {isSuspended && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Suspended
                          </span>
                        )}
                        {biz.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {biz.headline || biz.tagline || biz.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {biz.city}, {biz.state}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {biz.phone}
                        </span>
                        <span className="text-slate-400">Slug: <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono">/biz/{biz.slug}</code></span>
                      </div>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex items-center gap-2 self-start">
                      <div className="text-center px-3 py-1.5 bg-slate-100 rounded-lg text-xs">
                        <span className="block font-black text-slate-800 text-sm">{biz._count.leads}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Leads</span>
                      </div>
                      <div className="text-center px-3 py-1.5 bg-slate-100 rounded-lg text-xs">
                        <span className="block font-black text-slate-800 text-sm">{biz._count.services}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Services</span>
                      </div>
                    </div>
                  </div>

                  {/* Rejection notice banner if rejected by admin */}
                  {isRejected && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
                      <p className="font-bold">Moderation Notice from Super Admin:</p>
                      <p>{biz.rejectionReason || 'Please review your business details and ensure guidelines are met.'}</p>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {isApproved ? (
                      <Link
                        href={`/biz/${biz.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Live Page
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Page inactive until re-approved</span>
                    )}

                    <Link
                      href={`/dashboard/businesses/${biz.id}/leads`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Inquiries & Sheet Sync ({biz._count.leads})
                    </Link>

                    <Link
                      href={`/dashboard/businesses/${biz.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-200 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details & SEO
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
