import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Legal Compliance</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: October 2026 | Compliant with India DPDP Act 2023 & GDPR
          </p>
        </div>

        <div className="prose prose-slate text-sm leading-relaxed space-y-4 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Overview & Data Fiduciary</h2>
            <p>
              This Privacy Policy describes how <strong>esitesz</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) processes and protects personal data
              when you use the esitesz SaaS platform, create a business storefront, or submit customer inquiries through our hosted pages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Data We Collect (Data Minimization)</h2>
            <p>In accordance with the Digital Personal Data Protection (DPDP) Act 2023, we collect only data strictly necessary:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Business Owners:</strong> Email address (for passwordless OTP login), business contact details (name, phone, WhatsApp, address, category, opening hours).</li>
              <li><strong>Inquiry Leads (End Customers):</strong> Customer name, phone number, requirement description, and optional email address submitted on business inquiry forms.</li>
              <li><strong>Technical Logs:</strong> Request timestamps, IP address (for rate limiting and DDoS prevention), and session security cookies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Purpose of Processing & Consent</h2>
            <p>
              We process data solely to provide business directory hosting, authenticate your account via one-time passwords,
              and route customer leads directly to the registered business owner. We never sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Your Rights Under DPDP Act 2023 & GDPR</h2>
            <p>As a data principal, you have the following guaranteed statutory rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right to Access:</strong> You can view all information associated with your business and received inquiries inside your dashboard.</li>
              <li><strong>Right to Correction:</strong> You can edit or update any business information at any time in real time.</li>
              <li><strong>Right to Erasure (Data Deletion):</strong> You can delete your business profile and all associated customer leads permanently with a single click.</li>
              <li><strong>Right to Grievance Redressal:</strong> Contact our designated Grievance Officer at <a href="mailto:privacy@esitesz.com" className="text-blue-600 underline">privacy@esitesz.com</a>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Security Safeguards</h2>
            <p>
              All traffic is encrypted over TLS/HTTPS. One-time passwords are cryptographically hashed using SHA-256 and expire after 10 minutes.
              Session tokens are stored inside strict HTTP-only cookies.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              For any privacy questions or requests to erase your account, email us at <a href="mailto:privacy@esitesz.com" className="text-blue-600 underline">privacy@esitesz.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
