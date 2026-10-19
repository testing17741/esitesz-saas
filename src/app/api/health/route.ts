import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    // Verify DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;

    return successResponse({
      status: 'healthy',
      service: 'esitesz-saas-engine',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      dbLatencyMs: latency,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return errorResponse('Service Unhealthy: Database connection error', 503, {
      timestamp: new Date().toISOString(),
      error: String(error),
    });
  }
}
