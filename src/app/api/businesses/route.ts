import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { businessSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  try {
    const businesses = await prisma.business.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            services: true,
            leads: true,
            faqs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ businesses });
  } catch (error) {
    logger.error('Failed to fetch businesses', { userId: user.id, error: String(error) });
    return errorResponse('Failed to load businesses', 500);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required to create a business', 401);
  }

  try {
    const body = await req.json();
    const parseResult = businessSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        parseResult.error.errors[0]?.message || 'Invalid business details submitted',
        422,
        parseResult.error.format()
      );
    }

    const data = parseResult.data;

    // Check if slug is already taken
    const existing = await prisma.business.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return errorResponse('This business URL slug is already taken. Please choose another.', 409);
    }

    // Default status is APPROVED ("sab approve rahega lekin mai reject bhi kar sakta hu")
    const business = await prisma.business.create({
      data: {
        userId: user.id,
        name: data.name,
        slug: data.slug,
        tagline: data.tagline || 'Excellence in every service we deliver',
        headline: data.headline || `Welcome to ${data.name} — Premium Quality & Direct Support`,
        description: data.description || `${data.name} provides professional, reliable and trusted services in ${data.city}. Contact us today for instant support and quotations.`,
        category: data.category,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        website: data.website || null,
        logoUrl: data.logoUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        themeColor: data.themeColor || '#2563eb',
        status: 'APPROVED',
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country || 'India',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        googleMapsUrl: data.googleMapsUrl || null,
        ctaText: data.ctaText || 'Send Inquiry',
        whatsappMessage: data.whatsappMessage || `Hi, I visited your website ${data.name} and would like more details.`,
        openingHours: data.openingHours || 'Mon - Sat: 9:00 AM - 8:00 PM',
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        metaTitle: data.metaTitle || `${data.name} | ${data.category} in ${data.city}`,
        metaDescription: data.metaDescription || `Official page for ${data.name}. Reliable ${data.category} in ${data.city}. Call ${data.phone} or send a quick inquiry.`,
        keywords: data.keywords || `${data.name}, ${data.category}, ${data.city}, services in ${data.city}`,
      },
    });

    // Seed default starter services matching samplebyesitesz
    await prisma.businessService.createMany({
      data: [
        {
          businessId: business.id,
          title: 'Core Service Offering',
          description: 'Our primary, highly trusted service delivered with guaranteed customer satisfaction.',
          price: 'Starting at ₹999',
          badge: 'Most Popular',
          order: 1,
        },
        {
          businessId: business.id,
          title: 'Express Consultation & Support',
          description: 'Fast, on-demand consultation tailored to your exact custom requirements.',
          price: 'Free Quote',
          badge: 'Quick Response',
          order: 2,
        },
        {
          businessId: business.id,
          title: 'Premium Package Solution',
          description: 'Comprehensive end-to-end execution with extended warranty and priority assistance.',
          price: 'Custom Pricing',
          badge: 'Comprehensive',
          order: 3,
        },
      ],
    });

    // Seed default starter FAQs for AEO optimization
    await prisma.businessFaq.createMany({
      data: [
        {
          businessId: business.id,
          question: `Where is ${business.name} located?`,
          answer: `${business.name} is conveniently located at ${business.address}, ${business.city}, ${business.state} ${business.pincode}.`,
          order: 1,
        },
        {
          businessId: business.id,
          question: `How can I contact ${business.name} or get a quote?`,
          answer: `You can reach out directly via WhatsApp at ${business.whatsapp}, call ${business.phone}, or submit an online inquiry on this page for an instant callback.`,
          order: 2,
        },
      ],
    });

    logger.info('Business created successfully', {
      businessId: business.id,
      slug: business.slug,
      userId: user.id,
    });

    return successResponse({ business }, 201);
  } catch (error) {
    logger.error('Failed to create business', { userId: user.id, error: String(error) });
    return errorResponse('Failed to create business. Please check details and try again.', 500);
  }
}
