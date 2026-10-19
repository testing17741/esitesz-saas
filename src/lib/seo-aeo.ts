interface BusinessWithRelations {
  name: string;
  slug: string;
  tagline?: string | null;
  headline?: string | null;
  description?: string | null;
  category: string;
  phone: string;
  whatsapp: string;
  email?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: string | null;
  services?: Array<{ title: string; description?: string | null; price?: string | null }>;
  faqs?: Array<{ question: string; answer: string }>;
}

export function generateLocalBusinessSchema(business: BusinessWithRelations, baseUrl: string) {
  const businessUrl = `${baseUrl}/biz/${business.slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${businessUrl}#business`,
    name: business.name,
    description: business.description || business.headline || business.tagline || `${business.name} in ${business.city}`,
    url: businessUrl,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.pincode,
      addressCountry: business.country || 'IN',
    },
    priceRange: '₹₹',
    openingHours: business.openingHours || 'Mo-Sa 09:00-20:00',
  };

  if (business.logoUrl) {
    schema.logo = business.logoUrl;
    schema.image = business.heroImageUrl || business.logoUrl;
  }

  if (business.latitude && business.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    };
  }

  if (business.services && business.services.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${business.name} Services & Offerings`,
      itemListElement: business.services.map((srv, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: srv.title,
          description: srv.description || srv.title,
        },
        price: srv.price || 'Contact for price',
        priceCurrency: 'INR',
        position: idx + 1,
      })),
    };
  }

  return schema;
}

export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(business: BusinessWithRelations, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: business.category || 'Businesses',
        item: `${baseUrl}/explore`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: business.name,
        item: `${baseUrl}/biz/${business.slug}`,
      },
    ],
  };
}

/**
 * Generates structured AI Answer Engine Optimization (AEO) summary
 * Suitable for LLM web search indexing (Google SGE / Perplexity / Copilot / ChatGPT Search)
 */
export function generateAeoSummary(business: BusinessWithRelations): string {
  const parts: string[] = [];
  parts.push(`Business Name: ${business.name}`);
  parts.push(`Category: ${business.category}`);
  parts.push(`Location: ${business.address}, ${business.city}, ${business.state} ${business.pincode}, ${business.country}`);
  parts.push(`Contact: Phone: ${business.phone} | WhatsApp: ${business.whatsapp}`);
  if (business.openingHours) {
    parts.push(`Hours: ${business.openingHours}`);
  }
  if (business.headline) {
    parts.push(`Overview: ${business.headline}`);
  }
  if (business.services && business.services.length > 0) {
    parts.push(`Services Offered: ${business.services.map((s) => `${s.title}${s.price ? ` (${s.price})` : ''}`).join(', ')}`);
  }
  return parts.join('\n');
}
