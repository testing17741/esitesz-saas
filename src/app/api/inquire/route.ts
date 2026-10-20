import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { inquirySchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || 'Please fill in all required fields.', 422);
    }

    const { businessId, name, phone, email, requirement } = parsed.data;

    // Verify business exists and is active/approved
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, status: true, whatsapp: true, email: true, googleSheetUrl: true },
    });

    if (!business) {
      return errorResponse('Target business not found.', 404);
    }

    if (business.status !== 'APPROVED') {
      return errorResponse('This business is currently under moderation review and cannot accept new inquiries.', 403);
    }

    // Create lead record in database (Instant Data Sync)
    const lead = await prisma.businessLead.create({
      data: {
        businessId: business.id,
        name,
        phone,
        email: email || null,
        requirement,
        status: 'NEW',
        source: 'landing_page_inquiry',
      },
    });

    // Real-time dispatch to connected Google Sheets Webhook (if configured by business owner)
    if (business.googleSheetUrl) {
      try {
        await fetch(business.googleSheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN'),
            businessName: business.name,
            name,
            phone,
            email: email || 'N/A',
            requirement,
            leadId: lead.id,
            source: 'esitesz_storefront',
          }),
        });
        logger.info('Lead dispatched to connected Google Sheet webhook', { businessId: business.id });
      } catch (sheetErr) {
        logger.warn('Failed to dispatch lead to Google Sheet webhook', { error: String(sheetErr) });
      }
    }

    logger.info('New customer lead received', {
      businessId: business.id,
      leadId: lead.id,
      customerName: name,
    });

    return successResponse({
      message: `Your inquiry has been directly dispatched to ${business.name}. They will reach you on ${phone} shortly.`,
      leadId: lead.id,
    });
  } catch (error) {
    logger.error('Failed to submit inquiry', { error: String(error) });
    return errorResponse('Failed to submit your inquiry. Please try again or reach the business directly via phone.', 500);
  }
}
