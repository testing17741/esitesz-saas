import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  code: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain numbers only'),
});

export const businessSchema = z.object({
  name: z.string().trim().min(2, 'Business name must have at least 2 characters').max(100),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters')
    .max(60, 'Slug must be 60 characters or fewer')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric and hyphens only (e.g. "sharma-electricals")'),
  tagline: z.string().trim().max(150).optional().nullable(),
  headline: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  category: z.string().trim().min(2).max(50).default('General Business'),
  
  phone: z.string().trim().min(8, 'Phone number must be at least 8 digits').max(20),
  whatsapp: z.string().trim().min(8, 'WhatsApp number must be at least 8 digits').max(20),
  email: z.string().trim().email('Invalid business contact email').optional().nullable().or(z.literal('')),
  website: z.string().trim().url('Invalid website URL').optional().nullable().or(z.literal('')),
  
  logoUrl: z.string().trim().url('Logo must be a valid URL').optional().nullable().or(z.literal('')),
  heroImageUrl: z.string().trim().url('Hero image must be a valid URL').optional().nullable().or(z.literal('')),
  themeColor: z.string().trim().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Theme color must be a valid HEX code (e.g. #2563eb)').default('#2563eb'),
  
  address: z.string().trim().min(3, 'Address is required for local SEO').max(250),
  city: z.string().trim().min(2, 'City is required for GEO local search').max(60),
  state: z.string().trim().min(2, 'State is required').max(60),
  pincode: z.string().trim().min(3, 'Postal code is required').max(12),
  country: z.string().trim().default('India'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  googleMapsUrl: z.string().trim().optional().nullable().or(z.literal('')),
  
  ctaText: z.string().trim().max(50).default('Send Inquiry'),
  whatsappMessage: z.string().trim().max(250).default('Hi, I visited your website and would like more details.'),
  openingHours: z.string().trim().max(200).default('Mon - Sat: 9:00 AM - 8:00 PM'),
  
  facebookUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  twitterUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().trim().url().optional().nullable().or(z.literal('')),

  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(160).optional().nullable(),
  keywords: z.string().trim().max(300).optional().nullable(),

  // Custom Domain & Subdomain
  customDomain: z.string().trim().optional().nullable().or(z.literal('')),
  subdomain: z.string().trim().optional().nullable().or(z.literal('')),
  domainStatus: z.string().trim().optional().nullable().or(z.literal('')),
  
  // Google Sheet Webhook Sync
  googleSheetUrl: z.string().trim().url('Must be a valid Webhook URL').optional().nullable().or(z.literal('')),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(100),
  description: z.string().trim().max(500).optional().nullable(),
  price: z.string().trim().max(50).optional().nullable(),
  badge: z.string().trim().max(30).optional().nullable(),
  icon: z.string().trim().max(40).optional().nullable(),
  imageUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3, 'Question is required').max(200),
  answer: z.string().trim().min(3, 'Answer is required').max(1000),
  order: z.number().int().default(0),
});

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  rating: z.number().int().min(1).max(5).default(5),
  comment: z.string().trim().min(3).max(500),
  locationOrRole: z.string().trim().max(100).optional().nullable(),
});

export const inquirySchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  phone: z.string().trim().min(8, 'Please enter a valid phone number').max(20),
  email: z.string().trim().email('Invalid email address').optional().nullable().or(z.literal('')),
  requirement: z.string().trim().min(3, 'Please describe your requirement').max(1000),
});

export const adminStatusSchema = z.object({
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED', 'SUSPENDED']),
  rejectionReason: z.string().trim().max(500).optional().nullable(),
});
