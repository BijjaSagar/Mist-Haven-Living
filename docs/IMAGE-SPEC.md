# CMS Image Specification — Mist & Haven Living

> **Quick reference:** [IMAGE-SPEC-QUICK.md](IMAGE-SPEC-QUICK.md) (one-page tables) · **[IMAGE-SPEC.pdf](IMAGE-SPEC.pdf)** (printable PDF)

Reference for every backend/CMS-managed image on the site: where to upload in admin, recommended dimensions, upload limits, and where each asset appears on the public site.

**Upload storage:** Files are written to `public/uploads/…` (or `.next/standalone/public/uploads/…` in standalone deploys) and served at `/uploads/…`.

**Save reminder:** After uploading in admin, click **Save** on the page/product/settings form so the URL is persisted to the database.

---

## Cache behavior (public site)

After **Save**, admin APIs call `revalidateSite()` so ISR pages and the shared site layout (header/footer logos) refresh immediately — you should not need to clear browser cache for new CMS images.

| Layer | Behavior |
|-------|----------|
| **ISR** | Public pages use `revalidate = 86400`; `revalidateSite()` busts page + root layout cache on every settings/pages/products save. |
| **Upload filenames** | Always unique: `{timestamp}-{random}.{ext}` under `/uploads/…` — new uploads never overwrite the same URL. |
| **Render URLs** | `cmsImageSrc()` appends `?v=` from DB `updatedAt` (logos, heroes) or the filename timestamp (uploads). |
| **HTTP headers** | `/uploads/*`, `/catalog/*`, `/certificates/*`: `Cache-Control: public, max-age=3600, must-revalidate`. Default `/logo.png` paths: `max-age=0, must-revalidate`. |
| **Next.js Image** | `/uploads/*` uses `unoptimized` (no optimizer disk cache in standalone). |
| **Hostinger CDN** | If HTML still looks stale after save, purge **hPanel → Performance / CDN → Clear cache** once (see `DEPLOYMENT.md`). |

Upload alone (before Save) does not change the public site — only the admin form field updates until the DB row is saved.

---

## Upload limits (global)

| Rule | Value |
|------|-------|
| **Max image size** | **5 MB** per file |
| **Max PDF size** | 15 MB (catalog/spec sheets — not images) |
| **Allowed image formats** | PNG, JPEG, WebP, SVG, ICO (favicon) |
| **MIME types accepted** | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/x-icon`, `image/vnd.microsoft.icon` |
| **Upload API** | `POST /api/admin/upload` (admin auth required) |
| **Client accept** | `image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico` |

Source: `app/api/admin/upload/route.ts`, `components/admin/ImageUploadField.tsx`.

---

## 1. Global / Settings

**Admin:** `/admin/settings` → **Branding**

| Field | Admin path | Page / section | Recommended size (px) | Aspect ratio | Max MB | Format |
|-------|------------|----------------|----------------------|--------------|--------|--------|
| `logoUrl` | Settings → Branding → **Logo (default)** | Site header (light backgrounds), SEO/JSON-LD fallback | 1024 × 682 | ~3∶2 (intrinsic in `Logo.tsx`) | 5 | PNG, WebP, SVG |
| `logoLightUrl` | Settings → Branding → **Logo (light / footer)** | Footer and dark surfaces (`variant="light"`) | 1024 × 682 | ~3∶2 | 5 | PNG, WebP, SVG |
| `faviconUrl` | Settings → Branding → **Favicon** | Browser tab icon (when set via CMS) | 32 × 32 (or 16 × 16) | 1∶1 | 5 | ICO, PNG |

**Display notes**

- Header logo renders at ~96–118px width (`components/Logo.tsx`); supply a high-res source for crisp scaling.
- Default fallbacks: `/logo.png`, `/logo-light.png` if CMS fields are empty.
- Static favicons in `lib/seo.ts` (`favicon-16.png`, `favicon-32.png`) are used unless `faviconUrl` is wired in layout metadata.

**Upload folder:** Default `/uploads/` (no subfolder unless URL pasted manually).

---

## 2. Home page

**Admin:** `/admin/pages` → tab **home**

| Field | Admin path | Page / section | Recommended size (px) | Aspect ratio | Max MB | Format |
|-------|------------|----------------|----------------------|--------------|--------|--------|
| `hero.slides[].imageUrl` | Pages → home → **Hero slideshow slides** → Slide N → **Slide image** | Homepage hero carousel (`HeroSection`, right column) | 900 × 1125 | 4∶5 | 5 | PNG, JPEG, WebP |
| `heritage.imageUrl` | Pages → home → **Heritage block** → **Heritage image** | Stored in CMS; **not currently rendered** on homepage (text-only “Our Story” block) | 900 × 675 | 4∶3 | 5 | PNG, JPEG, WebP |
| `manufacturing.imageUrl` | Pages → home → **Manufacturing preview** → **Manufacturing section image** | Homepage “Manufacturing Strength” block (`ManufacturingSection`) | 1000 × 800 | 5∶4 | 5 | PNG, JPEG, WebP |

**Hero slides**

- Default seed data: **3 slides**. Admin can add/remove slides.
- Upload folder: `pages/home-hero` → `/uploads/pages/home-hero/…`
- Carousel container: `aspect-[4/5]`, `object-cover`, `sizes="(max-width: 1024px) 90vw, 45vw"`.

**Manufacturing preview**

- Upload folder: `pages/home-manufacturing` → `/uploads/pages/home-manufacturing/…`
- Display: `aspect-[5/4]`, half-width on large screens.

**Heritage**

- Upload folder: `pages/home-heritage` → `/uploads/pages/home-heritage/…`

---

## 3. About, Manufacturing, Private Label, FAQ, Contact, Products listing

**Admin:** `/admin/pages` → select page slug

### Page hero backgrounds (full-width)

Shared pattern: `min-h-[50vh]` (Private Label `min-h-[70vh]`), `fill` + `object-cover`, `sizes="100vw"`.

| Page slug | Field | Admin path | Public URL | Recommended size (px) | Aspect ratio | Max MB | Format |
|-----------|-------|------------|------------|----------------------|--------------|--------|--------|
| `about` | `hero.imageUrl` | Pages → about → Hero → **Hero background image** | `/about` hero | 1920 × 800 | ~2.4∶1 (wide) | 5 | PNG, JPEG, WebP |
| `manufacturing` | `hero.imageUrl` | Pages → manufacturing → Hero → **Hero background image** | `/manufacturing` hero | 1920 × 800 | ~2.4∶1 | 5 | PNG, JPEG, WebP |
| `private-label` | `hero.imageUrl` | Pages → private-label → Hero → **Hero background image** | `/private-label` hero | 1920 × 1000 | ~1.9∶1 | 5 | PNG, JPEG, WebP |
| `faq` | `hero.imageUrl` | Pages → faq → Hero → **Hero background image** | `/faq` hero | 1920 × 800 | ~2.4∶1 | 5 | PNG, JPEG, WebP |
| `contact` | `hero.imageUrl` | Pages → contact → Hero → **Hero background image** | `/contact` hero | 1920 × 800 | ~2.4∶1 | 5 | PNG, JPEG, WebP |
| `products` | `hero.imageUrl` | Pages → products → Hero → **Hero background image** | `/products` listing hero | 1920 × 800 | ~2.4∶1 | 5 | PNG, JPEG, WebP |

**Upload folders:** `pages/{slug}-hero` → e.g. `/uploads/pages/about-hero/…`

### Section images (non-hero)

| Page slug | Field | Admin path | Page / section | Recommended size (px) | Aspect ratio | Max MB | Format |
|-----------|-------|------------|----------------|----------------------|--------------|--------|--------|
| `about` | `intro.imageUrl` | Pages → about → Intro section → **Heritage / team image** | `/about` intro column | 800 × 1067 | 3∶4 | 5 | PNG, JPEG, WebP |
| `manufacturing` | `facility.imageUrl` | Pages → manufacturing → Facility banner → **Wide facility image** | `/manufacturing` full-width banner below hero | 1400 × 600 | 21∶9 | 5 | PNG, JPEG, WebP |
| `private-label` | `packaging.imageUrl` | Pages → private-label → Packaging image → **Private label packaging photo** | `/private-label` packaging block | 800 × 800 | 1∶1 | 5 | PNG, JPEG, WebP |

**Upload folders**

- About intro: `pages/about-intro` → `/uploads/pages/about-intro/…`
- Manufacturing facility: `pages/manufacturing-facility` → `/uploads/pages/manufacturing-facility/…`
- Private label packaging: `pages/private-label-packaging` → `/uploads/pages/private-label-packaging/…`

**Certifications page:** No CMS image fields (text + certification PDFs only).

---

## 4. Product categories

**Admin:** `/admin/products` → select category → `/admin/products/{slug}`

Each category has **two fixed image fields** plus an **optional multi-image gallery**.

| Field | Admin label | Page / section | Recommended size (px) | Aspect ratio | Max MB | Format |
|-------|-------------|----------------|----------------------|--------------|--------|--------|
| `heroImage` | **Hero image** | `/products/{slug}` top hero (`h-[50vh] min-h-[400px]`, full width) | 1400 × 900 | ~1.56∶1 (wide) | 5 | PNG, JPEG, WebP |
| `cardImage` | **Card image** | Product grids (`ProductCard`), homepage `CategoryGrid`, marquee context | 800 × 600 | 4∶3 (default card); 1∶1 when `variant="compact"` | 5 | PNG, JPEG, WebP |
| `galleryImages[]` | **Gallery images** (multi) | `/products/{slug}` gallery grid (if any images added) | 1200 × 900 | 4∶3 | 5 | PNG, JPEG, WebP |

**Upload folder:** `products/{slug}` → `/uploads/products/{slug}/…`

**Gallery:** Unlimited images per product; admin preview uses `aspect-[4/3]`. Display: 3-column grid on large screens, `sizes="(max-width: 768px) 100vw, 33vw"`.

### Per-category slots

| Slug | Product name | Hero + card paths |
|------|--------------|-------------------|
| `bath-towels` | Premium Bath Towels | `/admin/products/bath-towels` |
| `hand-towels` | Hand Towels | `/admin/products/hand-towels` |
| `face-towels` | Face Towels | `/admin/products/face-towels` |
| `bath-mats` | Bath Mats | `/admin/products/bath-mats` |
| `hotel-linen` | Hotel Linen | `/admin/products/hotel-linen` |
| `bath-robes` | Bath Robes | `/admin/products/bath-robes` |
| `kitchen-towels` | Kitchen Towels | `/admin/products/kitchen-towels` |
| `beach-towels` | Beach Towels | `/admin/products/beach-towels` |
| `pool-towels` | Pool Towels | `/admin/products/pool-towels` |
| `spa-towels` | Spa Towels | `/admin/products/spa-towels` |
| `private-labeling` | Private Labeling | `/admin/products/private-labeling` |
| `promotional-towels` | Promotional Towels | `/admin/products/promotional-towels` |

Each row above = 2 fixed image fields (`heroImage`, `cardImage`) + optional `galleryImages` entries.

**SEO:** `heroImage` is also used in product page Open Graph metadata.

---

## 5. Image slot summary

| Category | Fixed CMS fields | Variable fields |
|----------|------------------|-----------------|
| Global settings | 3 | — |
| Home | 5 (3 default hero slides + heritage + manufacturing) | Hero slides can grow/shrink |
| Other pages (heroes + sections) | 8 | — |
| Product categories (12) | 24 (hero + card per category) | Gallery: unlimited per category |
| **Total fixed fields** | **40** | **+ gallery images** |

### Fixed field checklist (40)

1. `logoUrl`, `logoLightUrl`, `faviconUrl`
2. Home: 3× `hero.slides[].imageUrl`, `heritage.imageUrl`, `manufacturing.imageUrl`
3. About: `hero.imageUrl`, `intro.imageUrl`
4. Manufacturing: `hero.imageUrl`, `facility.imageUrl`
5. Private label: `hero.imageUrl`, `packaging.imageUrl`
6. FAQ, Contact, Products: each `hero.imageUrl`
7. Products (12×): each `heroImage` + `cardImage`

---

## 6. Quick reference — aspect ratios in UI

| UI pattern | CSS / component | Typical use |
|------------|-----------------|-------------|
| Full-width hero | `fill`, `min-h-[50vh]`, `sizes="100vw"` | Page heroes, product hero |
| Portrait carousel | `aspect-[4/5]` | Homepage hero slides |
| Portrait column | `aspect-[3/4]` | About intro image |
| Wide banner | `aspect-[21/9]` | Manufacturing facility |
| Square | `aspect-square` | Private label packaging, compact product cards |
| Standard card | `aspect-[4/3]` | Product cards, gallery |
| Manufacturing block | `aspect-[5/4]` | Homepage manufacturing preview |
| Logo | intrinsic 1024×682, displayed ~96–118px wide | Header / footer |

---

## 7. External URLs

All `ImageUploadField` inputs accept pasted URLs (`/uploads/…` or `https://…`). Uploaded files always return paths under `/uploads/…`.

---

*Generated from codebase audit: upload route, admin editors, `lib/data/pages.ts` defaults, product schema, and site components (`HeroSection`, page templates, `ProductCard`, `ManufacturingSection`, `Logo`).*
