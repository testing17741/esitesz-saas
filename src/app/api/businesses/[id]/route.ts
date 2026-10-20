import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { businessSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  const { id } = params;

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        services: { orderBy: { order: 'asc' } },
        testimonials: { orderBy: { createdAt: 'desc' } },
        faqs: { orderBy: { order: 'asc' } },
        _count: {
          select: { leads: true },
        },
      },
    });

    if (!business) {
      return errorResponse('Business not found', 404);
    }

    if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return errorResponse('Access denied. You do not own this business profile.', 403);
    }

    return successResponse({ business });
  } catch (error) {
    logger.error('Failed to retrieve business', { businessId: id, error: String(error) });
    return errorResponse('Failed to retrieve business', 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  const { id } = params;

  try {
    const existing = await prisma.business.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse('Business not found', 404);
    }

    if (existing.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return errorResponse('Access denied', 403);
    }

    const body = await req.json();
    const parseResult = businessSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        parseResult.error.errors[0]?.message || 'Invalid details provided',
        422,
        parseResult.error.format()
      );
    }

    const data = parseResult.data;

    // Check if new slug conflicts with another business
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.business.findUnique({
        where: { slug: data.slug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return errorResponse('This slug is already in use by another business. Please pick a unique one.', 409);
      }
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        headline: data.headline,
        description: data.description,
        category: data.category,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        website: data.website || null,
        logoUrl: data.logoUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        themeColor: data.themeColor || '#2563eb',
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country || 'India',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        googleMapsUrl: data.googleMapsUrl || null,
        ctaText: data.ctaText || 'Send Inquiry',
        whatsappMessage: data.whatsappMessage,
        openingHours: data.openingHours,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        keywords: data.keywords || null,
        customDomain: data.customDomain || null,
        subdomain: data.subdomain || null,
        googleSheetUrl: data.googleSheetUrl || null,
      },
    });

    logger.info('Business profile updated', { businessId: id, slug: updated.slug });
    return successResponse({ business: updated });
  } catch (error) {
    logger.error('Failed to update business', { businessId: id, error: String(error) });
    return errorResponse('Failed to update business profile', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  const { id } = params;

  try {
    const existing = await prisma.business.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse('Business not found', 404);
    }

    if (existing.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return errorResponse('Access denied', 403);
    }

    await prisma.business.delete({
      where: { id },
    });

    logger.info('Business deleted', { businessId: id, userId: user.id });
    return successResponse({ message: 'Business successfully deleted' });
  } catch (error) {
    logger.error('Failed to delete business', { businessId: id, error: String(error) });
    return errorResponse('Failed to delete business profile', 500);
  }
}
