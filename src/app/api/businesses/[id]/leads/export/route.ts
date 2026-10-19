import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse('Authentication required', { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, name: true, slug: true },
  });

  if (!business) {
    return new NextResponse('Business not found', { status: 404 });
  }

  if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Access denied', { status: 403 });
  }

  const leads = await prisma.businessLead.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: 'desc' },
  });

  // Build CSV content
  const headers = ['Lead ID', 'Customer Name', 'Phone Number', 'Email', 'Requirement', 'Status', 'Date Time (UTC)'];
  const rows = leads.map((lead) => [
    lead.id,
    `"${(lead.name || '').replace(/"/g, '""')}"`,
    `"${(lead.phone || '').replace(/"/g, '""')}"`,
    `"${(lead.email || '').replace(/"/g, '""')}"`,
    `"${(lead.requirement || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    lead.status,
    lead.createdAt.toISOString(),
  ]);

  const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  return new NextResponse(csvString, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${business.slug}-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
