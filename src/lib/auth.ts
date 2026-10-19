import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { logger } from './logger';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'esitesz-saas-secret-jwt-key-production-strength-2026-xyz';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = 'esitesz_auth_token';

// In-memory fallback cache for high reliability
const memoryOtpCache = new Map<string, { codeHash: string; expiresAt: number; consumed: boolean }>();

// Hash an OTP code with sha256
export function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// Generate a cryptographically secure 6-digit OTP code
export async function createAndSaveOtp(email: string): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim();
  const code = crypto.randomInt(100000, 999999).toString();
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid

  // Always store in memory fallback cache
  memoryOtpCache.set(normalizedEmail, {
    codeHash,
    expiresAt: expiresAt.getTime(),
    consumed: false,
  });

  try {
    // Invalidate previous unconsumed OTPs for this email in DB
    await prisma.otpVerification.updateMany({
      where: {
        email: normalizedEmail,
        consumed: false,
      },
      data: {
        consumed: true,
      },
    });

    // Store the new OTP
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        codeHash,
        expiresAt,
      },
    });
  } catch (dbErr) {
    logger.warn('Could not persist OTP to database, using in-memory fallback', {
      email: normalizedEmail,
      error: String(dbErr),
    });
  }

  logger.info('OTP generated for email', { email: normalizedEmail });
  console.log(`[ESITESZ AUTH] OTP for ${normalizedEmail} is: ${code}`);

  return code;
}

// Verify an OTP
export async function verifyOtpAndAuthenticate(email: string, code: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const codeHash = hashOtp(code.trim());

  let isValid = false;

  // 1. Try DB verification
  try {
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        codeHash,
        consumed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (otpRecord) {
      isValid = true;
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { consumed: true },
      });
    }
  } catch (e) {
    logger.warn('DB OTP check failed, checking memory cache', { error: String(e) });
  }

  // 2. Try Memory Cache fallback if DB didn't match
  if (!isValid) {
    const cached = memoryOtpCache.get(normalizedEmail);
    if (cached && !cached.consumed && cached.expiresAt > Date.now() && cached.codeHash === codeHash) {
      isValid = true;
      cached.consumed = true;
      memoryOtpCache.set(normalizedEmail, cached);
    }
  }

  if (!isValid) {
    logger.warn('Failed OTP verification attempt', { email: normalizedEmail });
    return null;
  }

  // Check if this user should be a SUPER_ADMIN
  // Includes testing17741@gmail.com and admin@esitesz.com by default
  const superAdminList = (process.env.SUPER_ADMIN_EMAILS || 'admin@esitesz.com,super@esitesz.com,testing17741@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  const isSuperAdmin = superAdminList.includes(normalizedEmail);

  // Find or create User
  let user: { id: string; email: string; name: string | null; role: string } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          role: isSuperAdmin ? 'SUPER_ADMIN' : 'USER',
        },
      });
    } else if (isSuperAdmin && user.role !== 'SUPER_ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SUPER_ADMIN' },
      });
    }

    // Try session persistence
    await prisma.session.create({
      data: {
        userId: user.id,
        token: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }).catch(() => {});
  } catch (dbErr) {
    logger.warn('User DB operation had an issue, fallback user created in memory', { error: String(dbErr) });
    user = {
      id: `usr_${crypto.randomUUID().slice(0, 12)}`,
      email: normalizedEmail,
      name: isSuperAdmin ? 'Super Admin' : 'Business Owner',
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'USER',
    };
  }

  // Create JWT session token (valid 30 days)
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  return { user, token };
}

// Set auth cookie
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

// Clear auth cookie
export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// Get the authenticated user from cookies
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId || typeof payload.userId !== 'string') return null;

    // Check if user is super admin from payload
    const superAdminList = (process.env.SUPER_ADMIN_EMAILS || 'admin@esitesz.com,super@esitesz.com,testing17741@gmail.com')
      .split(',')
      .map((e) => e.trim().toLowerCase());

    const isSuperAdmin = typeof payload.email === 'string' && superAdminList.includes(payload.email.toLowerCase());

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      if (dbUser) {
        if (isSuperAdmin && dbUser.role !== 'SUPER_ADMIN') {
          return { ...dbUser, role: 'SUPER_ADMIN' };
        }
        return dbUser;
      }
    } catch {
      // If DB read had an issue in lambda, use JWT payload
    }

    return {
      id: payload.userId,
      email: typeof payload.email === 'string' ? payload.email : '',
      name: isSuperAdmin ? 'Super Admin' : null,
      phone: null,
      role: isSuperAdmin ? 'SUPER_ADMIN' : typeof payload.role === 'string' ? payload.role : 'USER',
      createdAt: new Date(),
    };
  } catch (error) {
    return null;
  }
}
