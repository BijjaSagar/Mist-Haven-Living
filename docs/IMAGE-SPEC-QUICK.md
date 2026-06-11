# CMS Image Quick Reference — Mist & Haven Living

**Also available:** [Full spec (IMAGE-SPEC.md)](IMAGE-SPEC.md) · [PDF (IMAGE-SPEC.pdf)](IMAGE-SPEC.pdf)

## Global upload rules

- **Images:** max **5 MB** — PNG, JPEG, WebP, SVG, ICO · `POST /api/admin/upload` (admin only)
- **PDFs** (catalogs/spec sheets): max **15 MB** — not for photos
- **After upload:** click **Save** on the form so the URL is stored

---

## Settings (3)

| Image name | Where (Admin) | Page | Size (W×H) | Max MB | Format |
|------------|---------------|------|------------|--------|--------|
| Logo (default) | Settings → Branding | Header (light bg) | 1024×682 | 5 | PNG, WebP, SVG |
| Logo (light) | Settings → Branding | Footer / dark bg | 1024×682 | 5 | PNG, WebP, SVG |
| Favicon | Settings → Branding | Browser tab | 32×32 | 5 | ICO, PNG |

---

## Home (5)

| Image name | Where (Admin) | Page | Size (W×H) | Max MB | Format |
|------------|---------------|------|------------|--------|--------|
| Hero slide image (×3) | Pages → home → Hero slides → Slide N | Homepage carousel | 900×1125 | 5 | PNG, JPEG, WebP |
| Heritage image | Pages → home → Heritage block | **Admin only — not on homepage yet** | 900×675 | 5 | PNG, JPEG, WebP |
| Manufacturing image | Pages → home → Manufacturing preview | Homepage “Manufacturing Strength” | 1000×800 | 5 | PNG, JPEG, WebP |

*Hero: 3 default slides; add/remove in admin. Upload folder: `pages/home-hero`.*

---

## Pages (8)

| Image name | Where (Admin) | Page | Size (W×H) | Max MB | Format |
|------------|---------------|------|------------|--------|--------|
| Hero background | Pages → about → Hero | `/about` hero | 1920×800 | 5 | PNG, JPEG, WebP |
| Heritage / team | Pages → about → Intro | `/about` intro | 800×1067 | 5 | PNG, JPEG, WebP |
| Hero background | Pages → manufacturing → Hero | `/manufacturing` hero | 1920×800 | 5 | PNG, JPEG, WebP |
| Facility banner | Pages → manufacturing → Facility | `/manufacturing` banner | 1400×600 | 5 | PNG, JPEG, WebP |
| Hero background | Pages → private-label → Hero | `/private-label` hero | 1920×1000 | 5 | PNG, JPEG, WebP |
| Packaging photo | Pages → private-label → Packaging | `/private-label` block | 800×800 | 5 | PNG, JPEG, WebP |
| Hero background | Pages → faq → Hero | `/faq` hero | 1920×800 | 5 | PNG, JPEG, WebP |
| Hero background | Pages → contact → Hero | `/contact` hero | 1920×800 | 5 | PNG, JPEG, WebP |

*Certifications page: no CMS images.*

---

## Products — listing + 12 categories (hero + card)

**Listing hero:** Pages → products → Hero → `/products` (1920×800, 5 MB, PNG/JPEG/WebP).

**Categories — Admin:** `/admin/products/{slug}` · Upload folder: `products/{slug}` · **Gallery:** optional, unlimited 1200×900 (4∶3) images per category — not listed below.

| Image name | Where (Admin) | Page | Size (W×H) | Max MB | Format |
|------------|---------------|------|------------|--------|--------|
| Hero image | Products → bath-towels | `/products/bath-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → bath-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → hand-towels | `/products/hand-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → hand-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → face-towels | `/products/face-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → face-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → bath-mats | `/products/bath-mats` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → bath-mats | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → hotel-linen | `/products/hotel-linen` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → hotel-linen | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → bath-robes | `/products/bath-robes` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → bath-robes | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → kitchen-towels | `/products/kitchen-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → kitchen-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → beach-towels | `/products/beach-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → beach-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → pool-towels | `/products/pool-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → pool-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → spa-towels | `/products/spa-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → spa-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → private-labeling | `/products/private-labeling` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → private-labeling | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |
| Hero image | Products → promotional-towels | `/products/promotional-towels` | 1400×900 | 5 | PNG, JPEG, WebP |
| Card image | Products → promotional-towels | Grids / homepage cards | 800×600 | 5 | PNG, JPEG, WebP |

**Totals:** 3 settings + 5 home + 8 page images + 1 products listing hero + 24 category (hero+card) = **40 fixed fields** + optional gallery images.
