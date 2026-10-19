'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('esitesz_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('esitesz_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('esitesz_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-700 shadow-2xl rounded-xl p-4 z-50 transition-all">
      <div className="flex items-start gap-3">
        <div className="text-xl">🛡️</div>
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">Privacy & Consent (DPDP Act & GDPR)</p>
          <p>
            We use strictly necessary cookies to ensure secure passwordless OTP logins and business inquiry routing.
            By browsing, you agree to our{' '}
            <Link href="/privacy" className="underline font-medium text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={handleDecline}
          className="text-xs px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Decline Optional
        </button>
        <button
          onClick={handleAccept}
          className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
