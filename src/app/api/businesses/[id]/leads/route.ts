import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

interface RouteContext {
  params: { id: string };
}

const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED']),
});

export async function GET(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return errorResponse('Authentication required', 401);

  const business = await prisma.business.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, name: true },
  });

  if (!business) return errorResponse('Business not found', 404);
  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied', 403);
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    const leads = await prisma.businessLead.findMany({
      where: {
        businessId: business.id,
        ...(statusFilter && statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { phone: { contains: search } },
                { requirement: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ leads, businessName: business.name });
  } catch (error) {
    return errorResponse('Failed to fetch leads', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return errorResponse('Authentication required', 401);

  const business = await prisma.business.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true },
  });

  if (!business) return errorResponse('Business not found', 404);
  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied', 403);
  }

  try {
    const body = await req.json();
    const parsed = updateLeadStatusSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Invalid lead data', 422);
    }

    const lead = await prisma.businessLead.update({
      where: { id: parsed.data.leadId, businessId: business.id },
      data: { status: parsed.data.status },
    });

    return successResponse({ lead });
  } catch (error) {
    return errorResponse('Failed to update lead status', 500);
  }
}
