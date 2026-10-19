import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { logger } from './logger';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'fallback-secret-for-esitesz-saas-development-32chars';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = 'esitesz_auth_token';

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

  // Invalidate previous unconsumed OTPs for this email
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

  logger.info('OTP generated for email', { email: normalizedEmail });

  // In development or when SMTP is not configured, we log the OTP code clearly
  console.log(`\n======================================================`);
  console.log(`[ESITESZ AUTH] OTP for ${normalizedEmail} is: ${code}`);
  console.log(`Valid for 10 minutes.`);
  console.log(`======================================================\n`);

  return code;
}

// Verify an OTP
export async function verifyOtpAndAuthenticate(email: string, code: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const codeHash = hashOtp(code.trim());

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

  if (!otpRecord) {
    logger.warn('Failed OTP verification attempt', { email: normalizedEmail });
    return null;
  }

  // Mark consumed
  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { consumed: true },
  });

  // Check if this user should be a SUPER_ADMIN
  const superAdminList = (process.env.SUPER_ADMIN_EMAILS || 'admin@esitesz.com,super@esitesz.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  const isSuperAdmin = superAdminList.includes(normalizedEmail);

  // Find or create User
  let user = await prisma.user.findUnique({
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

  // Record session in database
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

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

    const user = await prisma.user.findUnique({
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

    return user;
  } catch (error) {
    logger.debug('Token verification failed or expired');
    return null;
  }
}
