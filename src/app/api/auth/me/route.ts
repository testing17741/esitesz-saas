import { getCurrentUser, clearAuthCookie } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse('Not authenticated', 401);
  }
  return successResponse({ user });
}

export async function POST() {
  clearAuthCookie();
  return successResponse({ message: 'Logged out successfully' });
}
