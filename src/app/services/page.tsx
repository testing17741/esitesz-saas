import Link from 'next/link';
import {
  FileSpreadsheet,
  Globe,
  ShieldCheck,
  Zap,
  ArrowRight,
  Server,
  MessageCircle,
  PhoneCall,
  Search,
} from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      icon: Globe,
      title: 'Digital Business Storefronts',
      description:
        'Instant, mobile-optimized business pages complete with your branding, services catalog, pricing tiers, and physical location maps.',
      badge: 'Core Engine',
      link: '/#sample-preview',
    },
    {
      icon: FileSpreadsheet,
      title: 'Instant Lead Sheet Synchronization',
      description:
        'Customer inquiries captured on your storefront are automatically recorded in real time into your leads dashboard and ready to export into Excel or Google Sheets.',
      badge: 'Data Sync',
      link: '/#sync',
    },
    {
      icon: Search,
      title: 'AEO (AI Answer Engine Optimization)',
      description:
        'Structured FAQPage and Organization Schema.org JSON-LD built directly into every page so AI search engines like ChatGPT, Gemini, and Perplexity cite your business accurately.',
      badge: 'AI Search',
      link: '/#features',
    },
    {
      icon: Server,
      title: 'Custom Domain & Subdomain Integration',
      description:
        'Connect your own custom domain (e.g. yourshop.in) or claim a free branded subdomain (yourshop.esitesz.com) with automatic HTTPS SSL certificates.',
      badge: 'Branding',
      link: '/domains',
    },
    {
      icon: MessageCircle,
      title: 'Direct WhatsApp Automation',
      description:
        'Pre-filled WhatsApp CTA buttons and sticky mobile bars that enable potential customers to start a conversation with you in a single tap.',
      badge: 'High Conversion',
      link: '/#sample-preview',
    },
    {
      icon: ShieldCheck,
      title: 'Super Admin Verified Moderation',
      description:
        'Every storefront receives a verified platform badge, while maintaining master moderation controls to reject fraudulent or misleading listings.',
      badge: 'Trust & Safety',
      link: '/admin',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="space-y-3 text-center">
        <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
          SaaS Solutions &amp; Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Everything You Need to Convert Local Traffic
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore our suite of local conversion tools designed specifically for local service providers, retailers, and modern businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceList.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                    {srv.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={srv.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Put These Services to Work?</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Sign up with your email and launch your custom business storefront in under two minutes.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
        >
          Get Started Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
