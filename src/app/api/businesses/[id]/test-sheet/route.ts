import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  const { id } = params;

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      select: { id: true, userId: true, name: true, googleSheetUrl: true },
    });

    if (!business) {
      return errorResponse('Business not found', 404);
    }

    if (business.userId !== user.id && user.role !== 'SUPER_ADMIN') {
      return errorResponse('Access denied', 403);
    }

    if (!business.googleSheetUrl) {
      return errorResponse('No Google Sheet Webhook URL has been configured for this business.', 400);
    }

    const testPayload = {
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      businessName: business.name,
      name: 'Test Customer (esitesz)',
      phone: '+91 99999 99999',
      email: 'test@esitesz.com',
      requirement: 'Testing Google Sheet realtime sync integration from esitesz dashboard.',
      source: 'dashboard_test_sync',
    };

    const res = await fetch(business.googleSheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    logger.info('Test lead dispatched to Google Sheet', {
      businessId: id,
      status: res.status,
    });

    return successResponse({
      message: 'Test row dispatched successfully to your Google Sheet! Please check your Google Sheet.',
    });
  } catch (error) {
    logger.error('Failed to dispatch test lead to Google Sheet', { businessId: id, error: String(error) });
    return errorResponse(
      'Could not connect to the Google Sheet Webhook URL. Please ensure your Apps Script is deployed as a Web App with access set to "Anyone".',
      500
    );
  }
}
