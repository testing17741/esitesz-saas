export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Terms of Service</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Platform Terms of Use</h1>
          <p className="text-xs text-slate-500 mt-1">Effective Date: October 2026 | Developed by esitesz</p>
        </div>

        <div className="prose prose-slate text-sm leading-relaxed space-y-4 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the <strong>esitesz</strong> SaaS platform, you agree to be bound by these Terms of Service.
              If you are registering on behalf of a commercial business, you represent that you have authority to bind that entity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Business Moderation & Approval</h2>
            <p>
              By default, newly created business storefronts are approved for publishing to maximize speed.
              However, <strong>esitesz Platform Administration (Super Admin)</strong> reserves the absolute right to review, reject,
              or suspend any listing that contains misleading advertisements, counterfeit products, or fraudulent offers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Accurate Business Representation</h2>
            <p>
              Users agree to provide true, accurate, and current information regarding their business name, address, contact phone,
              and services. Impersonating existing registered trademarks or other individuals is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Customer Inquiries & Leads</h2>
            <p>
              Leads captured on your business storefront are owned by you. You agree to use customer contact information
              solely to respond to their direct inquiry and in strict compliance with applicable spam and data protection legislation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              esitesz provides the software platform on an &quot;as-is&quot; basis. We are not responsible for transactions or agreements
              made between business owners and their end customers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
