import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for esitesz SaaS...');

  // Create Super Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@esitesz.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@esitesz.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  // Also pre-authorize testing17741@gmail.com as Super Admin
  const ownerUser = await prisma.user.upsert({
    where: { email: 'testing17741@gmail.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: 'testing17741@gmail.com',
      name: 'Esitesz Owner',
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`Created/Verified Super Admins: ${adminUser.email}, ${ownerUser.email}`);

  // Create standard sample business matching samplebyesitesz reference
  const sampleBiz = await prisma.business.upsert({
    where: { slug: 'samplebyesitesz' },
    update: {
      status: 'APPROVED',
      headline: 'YOUR MAIN HEADLINE HERE',
      phone: '+91 91526 67967',
      whatsapp: '+91 91526 67967',
      email: 'testing17741+esitesz@gmail.com',
      address: 'Wadala (West)',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400031',
    },
    create: {
      userId: adminUser.id,
      name: 'Esitesz Blueprint Solutions',
      slug: 'samplebyesitesz',
      headline: 'YOUR MAIN HEADLINE HERE',
      tagline: 'The Automated Inquiry System & Local Business Engine',
      description: 'Showcase business profile demonstrating instant WhatsApp leads, Google Maps integration, and real-time leads sheet synchronization.',
      category: 'Digital & Local Services',
      phone: '+91 91526 67967',
      whatsapp: '+91 91526 67967',
      email: 'testing17741+esitesz@gmail.com',
      website: 'https://esitesz.com',
      themeColor: '#2563eb',
      status: 'APPROVED',
      address: 'Wadala (West)',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400031',
      country: 'India',
      openingHours: 'Mon - Sat: 9:30 AM - 7:30 PM, Sun: Closed',
      ctaText: 'Send Free Inquiry',
      whatsappMessage: 'Hi Zainuddin, I saw your showcase website on esitesz and would like to discuss a project.',
      metaTitle: 'Esitesz Blueprint Solutions | Web Design Agency Mumbai',
      metaDescription: 'Official business storefront for Esitesz, Wadala, Mumbai. Call or WhatsApp +91 91526 67967 for quotes.',
      keywords: 'esitesz, web development mumbai, wadala web designer, zainuddin chaudhary',
    },
  });

  // Services
  await prisma.businessService.deleteMany({ where: { businessId: sampleBiz.id } });
  await prisma.businessService.createMany({
    data: [
      {
        businessId: sampleBiz.id,
        title: 'Core Service Offering',
        description: 'Our primary, highly trusted service delivered with guaranteed customer satisfaction and fast turnaround.',
        price: 'Starts at ₹999',
        badge: 'Most Popular',
        order: 1,
      },
      {
        businessId: sampleBiz.id,
        title: 'Express Consultation & Support',
        description: 'Fast, on-demand consultation tailored directly to your local requirements with direct phone assistance.',
        price: 'Free Quote',
        badge: 'Quick Response',
        order: 2,
      },
      {
        businessId: sampleBiz.id,
        title: 'Custom Architecture & Setup',
        description: 'Comprehensive end-to-end execution with extended warranty, priority assistance, and local support.',
        price: 'Custom Pricing',
        badge: 'Comprehensive',
        order: 3,
      },
    ],
  });

  // FAQs for AEO
  await prisma.businessFaq.deleteMany({ where: { businessId: sampleBiz.id } });
  await prisma.businessFaq.createMany({
    data: [
      {
        businessId: sampleBiz.id,
        question: 'How does the automated inquiry system work?',
        answer: 'When a customer fills out the inquiry form on your website, their contact details are recorded into your leads dashboard and synced to your leads sheet in real time.',
        order: 1,
      },
      {
        businessId: sampleBiz.id,
        question: 'Can I edit my business details, hours, and offerings anytime?',
        answer: 'Yes! You can update your business name, contact info, working hours, services, and SEO tags anytime through your esitesz dashboard.',
        order: 2,
      },
      {
        businessId: sampleBiz.id,
        question: 'How are leads sent to my phone?',
        answer: 'You can chat directly with inquiring customers via the WhatsApp quick button or download the leads sheet into Excel or Google Sheets.',
        order: 3,
      },
    ],
  });

  // Starter Leads for "The Magic Section"
  await prisma.businessLead.deleteMany({ where: { businessId: sampleBiz.id } });
  await prisma.businessLead.createMany({
    data: [
      {
        businessId: sampleBiz.id,
        name: 'Rohan K.',
        phone: '+91 98123 45678',
        email: 'rohan.k@example.com',
        requirement: 'Need quotation for rooftop solar panel installation and wiring in Pune.',
        status: 'NEW',
        source: 'landing_page_inquiry',
      },
      {
        businessId: sampleBiz.id,
        name: 'Amit S.',
        phone: '+91 88001 12233',
        email: 'amit.s@example.com',
        requirement: 'Looking for commercial electrical wiring maintenance for retail showroom.',
        status: 'CONTACTED',
        source: 'landing_page_inquiry',
      },
    ],
  });

  console.log(`Seeded reference business: /biz/${sampleBiz.slug}`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
