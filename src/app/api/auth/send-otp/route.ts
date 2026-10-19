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

    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    return successResponse({
      message: hasSmtp
        ? 'Verification code dispatched to your email address.'
        : 'Verification code generated successfully. Enter the code shown below to sign in.',
      email,
      // Provide devOtp if SMTP is not configured so user is never locked out on preview/demo deployments
      devOtp: !hasSmtp ? otp : undefined,
    });
  } catch (error) {
    logger.error('Error in send-otp route', { error: String(error) });
    return errorResponse('Failed to send verification code. Please try again.', 500);
  }
}
