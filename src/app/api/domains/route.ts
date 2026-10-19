import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const domainRequestSchema = z.object({
  businessSlug: z.string().optional().nullable(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  domainType: z.enum(['CUSTOM_DOMAIN', 'SUBDOMAIN']),
  domainName: z
    .string()
    .trim()
    .min(3, 'Domain name is required')
    .max(100)
    .regex(/^[a-z0-9.-]+$/, 'Please enter a valid domain format (e.g. yourshop.in or yourshop.esitesz.com)'),
  notes: z.string().max(500).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = domainRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Invalid domain request data', 422);
    }

    const { businessSlug, email, phone, domainType, domainName, notes } = parsed.data;

    let businessId: string | null = null;
    if (businessSlug) {
      const biz = await prisma.business.findUnique({
        where: { slug: businessSlug },
        select: { id: true },
      });
      if (biz) {
        businessId = biz.id;
        await prisma.business.update({
          where: { id: biz.id },
          data: {
            customDomain: domainType === 'CUSTOM_DOMAIN' ? domainName : undefined,
            subdomain: domainType === 'SUBDOMAIN' ? domainName.replace('.esitesz.com', '') : undefined,
            domainStatus: 'PENDING',
          },
        });
      }
    }

    const request = await prisma.domainRequest.create({
      data: {
        businessId,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        domainType,
        domainName: domainName.toLowerCase().trim(),
        status: 'PENDING',
        notes: notes || null,
      },
    });

    return successResponse({
      message: `Your ${domainType === 'CUSTOM_DOMAIN' ? 'custom domain' : 'subdomain'} request for ${domainName} has been submitted. Our team will verify DNS and activate it shortly.`,
      request,
    }, 201);
  } catch (error) {
    return errorResponse('Failed to record domain connection request. Please try again.', 500);
  }
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return errorResponse('Super Admin credentials required', 403);
  }

  try {
    const requests = await prisma.domainRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return successResponse({ requests });
  } catch (error) {
    return errorResponse('Failed to load domain requests', 500);
  }
}
