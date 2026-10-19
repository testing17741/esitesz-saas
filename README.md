# esitesz SaaS — Production Local Business & Lead Sync Engine

> **Developed by esitesz**  
> Inspired by [samplebyesitesz.esitesz.com](https://samplebyesitesz.esitesz.com/)

A production-grade, full-stack multi-tenant SaaS platform that enables local businesses to launch high-converting digital storefronts with instant WhatsApp inquiries, direct-to-phone leads sheet synchronization, and full Answer Engine Optimization (AEO) and Geo-Search (GEO) schema markup.

---

## 🚀 Key Features

### 1. Passwordless Email OTP Authentication
- Secure 6-digit numeric OTP generation with SHA-256 cryptographic hashing.
- 10-minute expiry window and single-use protection.
- Session management via high-security HTTP-only JWT cookies (`jose`).

### 2. Business Profile Builder & Full CRUD
- Storefront customization: Business Name, Custom Slug (`/biz/[slug]`), Headline, Tagline, Category, Brand Theme Color, Logo, and Shop Photos.
- Direct Contact: Phone calling button, WhatsApp integration with customizable pre-filled message template.
- Services & Offerings catalog with pricing, badges, and descriptions.
- Operating hours and physical location mapping.

### 3. Automated Inquiry System ("The Magic Section: Form to Sheet")
- **Instant Data Sync**: When visitors submit inquiries on the public storefront, leads are logged into the database in real-time.
- **Live Leads Dashboard**: Filter, search, and update inquiry status (`NEW` → `CONTACTED` → `CONVERTED` → `DISMISSED`).
- **1-Click Export**: Download leads directly in Excel/CSV format (`.csv`).
- **Direct WhatsApp Follow-up**: One-click WhatsApp action to message prospective customers immediately.

### 4. Search, AEO & GEO Engine
- **SEO**: Semantic HTML5, canonical URLs, dynamic OpenGraph, and Twitter cards.
- **AEO (Answer Engine Optimization)**: Schema.org `FAQPage` JSON-LD embedded for AI search engines (ChatGPT Search, Perplexity, Google SGE, Gemini).
- **GEO (Local Search Optimization)**: Schema.org `LocalBusiness`, `GeoCoordinates`, and `PostalAddress` structured data for Google Maps rankings.
- Dynamic `/sitemap.xml` and `/robots.txt`.

### 5. Super Admin Moderation Control ("Mai Super Rahunga")
- **Default Instant Approval**: Newly created businesses are live by default (`APPROVED`) for immediate publishing.
- **Admin Moderation Power**: Super Admin can review all platform listings, inspect leads, and **Reject** (with custom rejection reasoning) or **Suspend** any storefront.
- **Platform Analytics**: Total businesses, active storefronts, leads captured, and registered users.

### 6. Mobile Conversion Optimization
- **Sticky Bottom Action Bar**: Fixed WhatsApp & Call Now buttons on smartphones to drive immediate customer action.

### 7. Legal & Compliance
- **India DPDP Act 2023 Compliant**: Data minimization, explicit consent banner, clear privacy disclosures, and single-click data erasure.
- **WCAG 2.1 AA Accessibility**: High-contrast typography, accessible touch targets (≥44px), semantic tags.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with CSS Variables (Light & Dark tokens)
- **Database & ORM**: SQLite (zero-config local) / PostgreSQL (via Prisma ORM)
- **Validation**: Zod (Client & Server schemas)
- **Icons**: Lucide React
- **Auth**: Passwordless Email OTP + Jose JWT HTTP-only Cookies

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone <your-github-repo-url>
cd busy-volta
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `"file:./dev.db"` |
| `JWT_SECRET` | Secret key for JWT session encryption (min 32 chars) | Random 32+ string |
| `SUPER_ADMIN_EMAILS` | Comma-separated emails granted Super Admin access | `"admin@esitesz.com,super@esitesz.com"` |
| `NEXT_PUBLIC_APP_URL` | Public base URL of your deployed application | `"http://localhost:3000"` |

### 3. Initialize Database & Seed
```bash
npx prisma generate
npx prisma db push
node scripts/seed.mjs
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Credentials

- **Super Admin**: Sign in with `admin@esitesz.com`. The OTP will appear on the login screen in test mode and inside your terminal logs.
- **Demo Storefront**: Visit [http://localhost:3000/biz/samplebyesitesz](http://localhost:3000/biz/samplebyesitesz) to view the reference blueprint.
- **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete esitesz SaaS platform"
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables (`JWT_SECRET`, `SUPER_ADMIN_EMAILS`, `DATABASE_URL`).
4. Click **Deploy**. Vercel will build and serve your SaaS platform automatically.

---

## 📄 License & Attribution
Developed with pride by **esitesz**.
