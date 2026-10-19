import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                e
              </span>
              <span className="text-xl font-bold text-white tracking-tight">esitesz</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The high-converting digital presence and automated inquiry engine for modern local businesses.
              Built for speed, AEO, SEO, and direct WhatsApp lead conversion.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                🚀 Developed by <span className="text-blue-400 font-semibold">esitesz</span>
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Product Overview
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition">
                  Email OTP Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new" className="hover:text-white transition">
                  Create Business Page
                </Link>
              </li>
              <li>
                <Link href="/#sample-preview" className="hover:text-white transition">
                  Reference Blueprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal & Compliance</h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@esitesz.com" className="hover:text-white transition">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} esitesz. All rights reserved. Developed by esitesz.</p>
          <p className="flex items-center gap-2">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>India DPDP Act 2023 Compliant</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
