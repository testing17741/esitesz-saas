'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                e
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  esitesz<span className="text-blue-600">.</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400 -mt-1">
                  Business Engine
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link href="/#features" className="hover:text-blue-600 transition">
                Features
              </Link>
              <Link href="/services" className="hover:text-blue-600 transition">
                Services
              </Link>
              <Link href="/about" className="hover:text-blue-600 transition">
                About
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition">
                Contact
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Super Admin
              </Link>
            </div>
          </div>

          {/* Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard/new"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Business
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : !loading ? (
              <>
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Super Admin
                </Link>
                <Link
                  href="/auth/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  Get Started Free
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
