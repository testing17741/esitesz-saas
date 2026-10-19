import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * Returns the proper database connection URL.
 * In Vercel serverless environments, SQLite files must reside in /tmp
 * because the lambda root filesystem is read-only.
 */
function getRuntimeDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || 'file:./dev.db';

  // If using external PostgreSQL/MySQL (Neon, Supabase, Vercel Postgres), return directly
  if (!envUrl.startsWith('file:')) {
    return envUrl;
  }

  // If running in Vercel Serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'dev.db'),
        path.join(process.cwd(), 'prisma', 'dev.db'),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpDbPath);
            break;
          } catch (e) {
            console.error('Failed copying database to /tmp:', e);
          }
        }
      }
    }
    return `file:${tmpDbPath}`;
  }

  return envUrl;
}

const activeDbUrl = getRuntimeDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;

// PrismaClient singleton pattern to avoid connection exhaustion in Next.js development HMR
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
