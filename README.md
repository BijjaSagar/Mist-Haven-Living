# Mist & Haven Living

Premium B2B marketing website for **Mist & Haven Living** by Deepam Textiles — a lead-generation site targeting USA and Canada buyers.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 with Atelier design tokens
- shadcn/ui-style components (Button, Input, Dialog, Accordion)
- Fraunces + Inter via `next/font`
- Framer Motion (fade-up on scroll)
- react-hook-form + Zod
- Resend (inquiry API route)
- SSG/ISR-friendly for Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your Resend API key, leads email, and WhatsApp number
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for sending inquiry emails |
| `LEADS_TO_EMAIL` | Destination inbox for B2B leads |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code (e.g. `+919876543210`) |

## Routes

- `/` — Home
- `/about` — Company story
- `/products` — Product catalogue
- `/products/[slug]` — 12 category detail pages
- `/manufacturing` — Production process
- `/certifications` — Compliance & certifications
- `/private-label` — Private label programs
- `/contact` — Contact form + map

## Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel with env vars configured. Pages use ISR with 24-hour revalidation.

## Project Structure

```
app/                  # Pages, API routes, sitemap, robots
components/           # UI, layout, sections
data/products.ts      # Typed product/category content
lib/                  # Utils, SEO, validation, rate limiting
```
