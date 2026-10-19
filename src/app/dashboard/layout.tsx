import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { PlusCircle, Building2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Dashboard Subheader */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">User Dashboard</h1>
                {user.role === 'SUPER_ADMIN' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    <ShieldCheck className="w-3 h-3" /> Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Logged in as <span className="font-semibold text-slate-700">{user.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {user.role === 'SUPER_ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Moderation
                </Link>
              )}
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                Add Business
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">{children}</div>
    </div>
  );
}
