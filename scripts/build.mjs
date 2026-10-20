import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Auto-assign default environment variables if missing in build container (prevents Vercel P1012 build error)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
  console.log('[esitesz build] Defaulting DATABASE_URL: file:./dev.db');
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'esitesz-saas-production-jwt-key-2026-min-32chars-secure';
  console.log('[esitesz build] Defaulting JWT_SECRET for build step.');
}
if (!process.env.SUPER_ADMIN_EMAILS) {
  process.env.SUPER_ADMIN_EMAILS = 'admin@esitesz.com,super@esitesz.com,testing17741@gmail.com';
}
if (!process.env.NEXT_PUBLIC_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}

// 2. Generate Prisma Client
console.log('[esitesz build] 1/4: Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

// 3. Sync Database Schema
console.log('[esitesz build] 2/4: Syncing Database Schema...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.warn('[esitesz build] DB push notice:', e?.message || e);
}

// 4. Seed sample showcase and super admin
console.log('[esitesz build] 3/4: Initializing starter blueprint & admin...');
try {
  execSync('node scripts/seed.mjs', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.warn('[esitesz build] Seed notice:', e?.message || e);
}

// 5. Next.js Build
console.log('[esitesz build] 4/4: Compiling Next.js Application...');
execSync('npx next build', { stdio: 'inherit', env: process.env });
console.log('[esitesz build] Build completed successfully!');
