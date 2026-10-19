import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return errorResponse('Access denied. Super Administrator credentials required.', 403);
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    const businesses = await prisma.business.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { slug: { contains: search } },
                { city: { contains: search } },
                { user: { email: { contains: search } } },
              ],
            }
          : {}),
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, createdAt: true },
        },
        _count: {
          select: { services: true, leads: true, faqs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const counts = {
      total: await prisma.business.count(),
      approved: await prisma.business.count({ where: { status: 'APPROVED' } }),
      rejected: await prisma.business.count({ where: { status: 'REJECTED' } }),
      suspended: await prisma.business.count({ where: { status: 'SUSPENDED' } }),
      pending: await prisma.business.count({ where: { status: 'PENDING' } }),
      totalLeads: await prisma.businessLead.count(),
      totalUsers: await prisma.user.count(),
    };

    return successResponse({ businesses, counts });
  } catch (error) {
    return errorResponse('Failed to fetch admin businesses', 500);
  }
}
