import { NextRequest } from 'next/server';
import { sendOtpSchema } from '@/lib/validations';
import { createAndSaveOtp } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';
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

    logger.info('Dispatching OTP to recipient email', { email });

    // Send real transactional email to user inbox
    const emailResult = await sendOtpEmail({ to: email, code: otp });

    if (!emailResult.success) {
      logger.error('Failed to deliver OTP email', { email, error: emailResult.error });
      return errorResponse(
        emailResult.error || 'Unable to deliver verification code to your email. Please try again or check your email address.',
        500
      );
    }

    return successResponse({
      message: 'Verification code sent to your email address. Please check your inbox and spam folder.',
      email,
    });
  } catch (error) {
    logger.error('Unhandled error in send-otp route', { error: String(error) });
    return errorResponse('Failed to send verification code. Please try again.', 500);
  }
}
