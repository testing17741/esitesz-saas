import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { faqSchema } from '@/lib/validations';
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
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Invalid FAQ content', 422);
    }

    const faq = await prisma.businessFaq.create({
      data: {
        businessId: business.id,
        question: parsed.data.question,
        answer: parsed.data.answer,
        order: parsed.data.order,
      },
    });

    return successResponse({ faq }, 201);
  } catch (error) {
    return errorResponse('Failed to create FAQ entry', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return errorResponse('Authentication required', 401);

  const { searchParams } = new URL(req.url);
  const faqId = searchParams.get('faqId');

  if (!faqId) return errorResponse('FAQ ID is required', 400);

  const business = await prisma.business.findUnique({ where: { id: params.id } });
  if (!business) return errorResponse('Business not found', 404);
  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied', 403);
  }

  try {
    await prisma.businessFaq.delete({
      where: { id: faqId, businessId: business.id },
    });
    return successResponse({ message: 'FAQ deleted' });
  } catch (error) {
    return errorResponse('Failed to delete FAQ', 500);
  }
}
