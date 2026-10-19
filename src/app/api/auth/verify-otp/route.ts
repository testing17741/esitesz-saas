import { NextRequest } from 'next/server';
import { verifyOtpSchema } from '@/lib/validations';
import { verifyOtpAndAuthenticate, setAuthCookie } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = verifyOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(parseResult.error.errors[0]?.message || 'Invalid input data', 422);
    }

    const { email, code } = parseResult.data;
    const authResult = await verifyOtpAndAuthenticate(email, code);

    if (!authResult) {
      return errorResponse('Invalid or expired OTP code. Please request a new one.', 401);
    }

    const { user, token } = authResult;
    setAuthCookie(token);

    logger.info('User successfully authenticated via OTP', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse({
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error verifying OTP', { error: String(error) });
    return errorResponse('Internal authentication error. Please try again.', 500);
  }
}
