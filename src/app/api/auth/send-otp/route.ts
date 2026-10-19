import { NextRequest } from 'next/server';
import { sendOtpSchema } from '@/lib/validations';
import { createAndSaveOtp } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = sendOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(parseResult.error.errors[0]?.message || 'Invalid email address', 422);
    }

    const { email } = parseResult.data;
    const otp = await createAndSaveOtp(email);

    logger.info('OTP request processed', { email });

    return successResponse({
      message: 'OTP has been dispatched to your email address.',
      email,
      // For developer ease in dev environments, include OTP in response if not production
      ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    });
  } catch (error) {
    logger.error('Error in send-otp route', { error: String(error) });
    return errorResponse('Failed to send verification code. Please try again.', 500);
  }
}
