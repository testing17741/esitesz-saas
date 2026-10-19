import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { adminStatusSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied. Super Administrator privileges required.', 403);
  }

  const { id } = params;

  try {
    const body = await req.json();
    const parsed = adminStatusSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Invalid status data', 422);
    }

    const { status, rejectionReason } = parsed.data;

    const existing = await prisma.business.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, status: true },
    });

    if (!existing) {
      return errorResponse('Business profile not found', 404);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason || 'Does not meet platform quality or verification guidelines.' : null,
      },
    });

    logger.info('Super Admin updated business moderation status', {
      businessId: id,
      slug: updated.slug,
      oldStatus: existing.status,
      newStatus: status,
      adminId: user.id,
      rejectionReason,
    });

    return successResponse({
      message: `Business status successfully changed to ${status}`,
      business: updated,
    });
  } catch (error) {
    logger.error('Failed to update business moderation status', { businessId: id, error: String(error) });
    return errorResponse('Failed to update status', 500);
  }
}
