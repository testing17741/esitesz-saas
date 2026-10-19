import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Fetch all approved businesses
  let businesses: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    businesses = await prisma.business.findMany({
      where: { status: 'APPROVED' },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Failed to query businesses for sitemap', e);
  }

  const businessEntries: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${baseUrl}/biz/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...businessEntries,
  ];
}
