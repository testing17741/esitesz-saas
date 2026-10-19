import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { serviceSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return errorResponse('Authentication required', 401);

  const business = await prisma.business.findUnique({ where: { id: params.id } });
  if (!business) return errorResponse('Business not found', 404);
  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied', 403);
  }

  try {
    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Invalid service details', 422);
    }

    const service = await prisma.businessService.create({
      data: {
        businessId: business.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        price: parsed.data.price || null,
        badge: parsed.data.badge || null,
        icon: parsed.data.icon || null,
        imageUrl: parsed.data.imageUrl || null,
        order: parsed.data.order,
      },
    });

    return successResponse({ service }, 201);
  } catch (error) {
    return errorResponse('Failed to create service', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return errorResponse('Authentication required', 401);

  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId');

  if (!serviceId) return errorResponse('Service ID is required', 400);

  const business = await prisma.business.findUnique({ where: { id: params.id } });
  if (!business) return errorResponse('Business not found', 404);
  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied', 403);
  }

  try {
    await prisma.businessService.delete({
      where: { id: serviceId, businessId: business.id },
    });
    return successResponse({ message: 'Service removed successfully' });
  } catch (error) {
    return errorResponse('Failed to delete service', 500);
  }
}
