import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import { StickyMobileBar } from '@/components/StickyMobileBar';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { slug: params.slug } });
  if (!business) return { title: 'Not Found' };
  return {
    title: `Services & Offerings | ${business.name} in ${business.city}`,
    description: `Browse all services and offerings provided by ${business.name} in ${business.city}. Get instant pricing and quotations.`,
  };
}

export default async function BusinessServicesPage({ params }: PageProps) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      services: { orderBy: { order: 'asc' } },
    },
  });

  if (!business || business.status !== 'APPROVED') {
    notFound();
  }

  return (
    <div className="bg-slate-50 text-slate-800 pb-24 md:pb-0 min-h-screen">
      <StorefrontHeader business={business} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <div className="space-y-3 text-center">
          <span className="bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 inline-block">
            Offerings &amp; Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Services Provided by {business.name}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Professional solutions delivered with guaranteed satisfaction across {business.city}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {business.services.map((srv, idx) => (
            <div
              key={srv.id}
              className="relative p-6 border border-slate-200 rounded-2xl bg-white hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  {srv.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase border border-blue-200">
                      {srv.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed min-h-[50px]">
                  {srv.description || 'Professional service delivered with dedicated support and standard warranty.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-black text-sm text-emerald-700">
                  {srv.price || 'Direct Estimate'}
                </span>
                <Link
                  href={`/biz/${business.slug}/contact`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1 transition"
                >
                  Book Service <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <StickyMobileBar
        phone={business.phone}
        whatsapp={business.whatsapp}
        whatsappMessage={business.whatsappMessage || ''}
      />
    </div>
  );
}
