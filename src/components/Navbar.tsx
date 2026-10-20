'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, LogOut, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                e
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  esitesz<span className="text-blue-600">.</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                  Business Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
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
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <>
                {/* Super Admin ONLY visible if authenticated user has role SUPER_ADMIN */}
                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Super Admin
                  </Link>
                )}

                <Link
                  href="/dashboard/new"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Business
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : !loading ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  Get Started Free
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {!loading && user && (
              <Link
                href="/dashboard"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white"
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Contact
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!loading && user ? (
              <>
                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Super Admin Portal
                  </Link>
                )}

                <Link
                  href="/dashboard/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Business Storefront
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-semibold text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({user.email})
                </button>
              </>
            ) : !loading ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-center font-semibold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-lg bg-blue-600 text-white text-center font-semibold text-xs shadow-sm"
                >
                  Get Started Free
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
