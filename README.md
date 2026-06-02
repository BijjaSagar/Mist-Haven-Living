# Mist & Haven Living

Premium B2B marketing website for **Mist & Haven Living** — a lead-generation site targeting USA and Canada buyers, with a MySQL-backed admin CMS.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 with Atelier design tokens
- Prisma ORM + MySQL
- shadcn/ui-style components (Button, Input, Dialog, Accordion)
- Cormorant Garamond + Inter via `next/font`
- Framer Motion (fade-up on scroll)
- react-hook-form + Zod
- Resend (inquiry API route)
- SSG/ISR-friendly for Node.js hosting (Hostinger) or Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up MySQL

Install MySQL locally, or use a hosted provider (PlanetScale, Railway, Aiven, etc.).

Create a database:

```sql
CREATE DATABASE mist_haven CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `ADMIN_EMAIL` | Admin panel login email |
| `ADMIN_PASSWORD` | Admin panel login password |
| `RESEND_API_KEY` | Resend API key for inquiry emails (required; server env only) |
| `LEADS_TO_EMAIL` | Optional fallback leads inbox (prefer **Admin → Settings**) |
| `RESEND_FROM_EMAIL` | Optional fallback Resend sender (prefer **Admin → Settings**) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional fallback WhatsApp (prefer **Admin → Settings**) |
| `NEXT_PUBLIC_CALENDLY_URL` | Optional fallback Calendly (prefer **Admin → Settings**) |

### 4. Run migrations and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

The seed script imports all 12 product categories, navigation links, stats, certifications, site settings, and page content from the existing static data — so the site looks identical after migration.

### 5. Run tests (optional)

```bash
npm run test
```

Vitest covers `lib/` helpers and Zod validations — no database or Resend required.

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin CMS

| Section | URL | Features |
|---|---|---|
| Dashboard | `/admin` | Overview and quick links |
| Settings | `/admin/settings` | Logo upload, colors, contact, footer |
| Navigation | `/admin/navigation` | Header/footer links CRUD |
| Products | `/admin/products` | All 12 category CRUD |
| Pages | `/admin/pages` | Hero content, SEO, JSON sections |
| Stats | `/admin/stats` | Stat strip values |
| Certifications | `/admin/certifications` | Compliance badges |

Changes trigger ISR revalidation automatically. Logo uploads are stored in `public/uploads/`.

**Note:** Without `DATABASE_URL` configured, the site falls back to static `data/products.ts` content so builds still succeed.

## Routes

- `/` — Home
- `/about` — Company story
- `/products` — Product catalogue
- `/products/[slug]` — 12 category detail pages
- `/manufacturing` — Production process
- `/certifications` — Compliance & certifications
- `/private-label` — Private label programs
- `/contact` — Contact form + map
- `/admin` — CMS admin panel

## Build & Deploy

```bash
npm run test   # unit tests (Vitest)
npm run build
npm start
```

### Hostinger Node.js (primary)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide. Summary:

1. Create a MySQL database in hPanel (host is usually `mysql.hostinger.com` or `srvXXX.hstgr.io`, not `localhost`)
2. Connect the GitHub repo in hPanel → Node.js Web Apps
3. Set environment variables from `.env.example`
4. Build command: `npm run build` — Start command: `npm start`
5. Run migrations once via SSH/terminal: `npx prisma migrate deploy && npx prisma db seed`

Logo uploads in `public/uploads/` persist on Hostinger's persistent server filesystem.

### Vercel (alternative)

1. Connect the repo to Vercel
2. Add all environment variables from `.env.example`
3. Use an external MySQL host — Vercel serverless does not include MySQL (PlanetScale, Railway, Aiven, etc.)
4. Run migrations against production DB: `npx prisma migrate deploy`
5. Note: `public/uploads` is ephemeral on Vercel serverless — use Vercel Blob or S3 for production logo uploads

## Database Schema

| Model | Purpose |
|---|---|
| `SiteSettings` | Singleton: branding, colors, contact, footer, address |
| `NavigationItem` | Header and footer menu links |
| `ProductCategory` | 12 product categories with full specs |
| `PageContent` | Static page sections (JSON) and SEO metadata |
| `Stat` | Homepage/about stat strip |
| `Certification` | Compliance badges and PDF links |

## Project Structure

```
app/
  admin/              # CMS admin panel
  api/admin/          # Admin CRUD + auth API routes
  api/inquiry/        # B2B inquiry form (unchanged)
components/
  admin/              # Admin UI components
  layout/             # Header, Footer (DB-driven)
lib/
  data/               # Server-side data access with static fallback
  auth/               # Admin JWT session
prisma/
  schema.prisma       # Database schema
  seed.ts             # Seed from data/products.ts
data/products.ts      # Static fallback + seed source
```
