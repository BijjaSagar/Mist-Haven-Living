import {
  deepMergeSections,
  mergeStringField,
} from "@/lib/branding";
import { prisma, isDbConfigured } from "@/lib/db";
import type { FaqItem, HeroSlide, PageContentData } from "@/lib/types/cms";
import { faqItems as defaultFaqItems } from "@/data/products";
import { siteConfig } from "@/lib/utils";

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    imageUrl: "https://picsum.photos/seed/mist-bath/900/1125",
    caption: "Premium Bath Towels",
  },
  {
    imageUrl: "https://picsum.photos/seed/mist-hotel/900/1125",
    caption: "Hotel & Spa Linen",
  },
  {
    imageUrl: "https://picsum.photos/seed/mist-private/900/1125",
    caption: "Private-Label Programs",
  },
];

export const DEFAULT_HOME_SECTIONS = {
  hero: {
    eyebrow: "Mist & Haven Living · Solapur, India",
    title: "Luxury In Every Thread.",
    subtitle:
      "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
    slides: DEFAULT_HERO_SLIDES,
  },
  heritage: {
    eyebrow: "Our Heritage",
    title: "Crafted in Solapur, India",
    description:
      "For over four decades, Mist & Haven Living has been at the heart of India's premier terry towel manufacturing region—bringing institutional-grade quality and boutique-level finishing to North American buyers.",
    imageUrl: "https://picsum.photos/seed/mist-factory/900/675",
  },
  manufacturing: {
    imageUrl: "https://picsum.photos/seed/mist-factory/900/720",
  },
};

export const DEFAULT_ABOUT_SECTIONS = {
  hero: {
    eyebrow: "Our Story",
    title: "Where heritage meets export excellence",
    imageUrl: "https://picsum.photos/seed/about-hero/1920/800",
  },
  intro: {
    title: "Four decades of textile excellence",
    body: "Founded in 1982 in Solapur—India's renowned terry towel manufacturing hub—Mist & Haven Living has grown from a regional producer to an export powerhouse serving buyers across North America and beyond.",
    imageUrl: "https://picsum.photos/seed/about-factory/800/1067",
  },
};

export const DEFAULT_MANUFACTURING_SECTIONS = {
  hero: {
    eyebrow: "Our Facility",
    title: "From yarn to export-ready carton",
    description:
      "120,000 sq ft of vertically integrated manufacturing in Solapur—with in-house weaving, dyeing, finishing, and quality laboratories.",
    imageUrl: "https://picsum.photos/seed/manufacturing-hero/1920/800",
  },
  facility: {
    imageUrl: "https://picsum.photos/seed/manufacturing-wide/1400/600",
  },
};

export const DEFAULT_PRIVATE_LABEL_SECTIONS = {
  hero: {
    eyebrow: "Private Label · High Priority",
    title: "Your brand. Our manufacturing excellence.",
    description:
      "Partner with Mist & Haven Living to launch, scale, or refresh your towel and linen brand. End-to-end private label—from first sample to retail-ready cartons shipped to USA and Canada.",
    imageUrl: "https://picsum.photos/seed/private-label-hero/1920/1000",
  },
  packaging: {
    imageUrl: "https://picsum.photos/seed/private-label-packaging/800/800",
  },
  specs: {
    title: "Private label specifications",
    description:
      "Download our private label capability sheet with GSM ranges, customization options, MOQs, lead times, and packaging formats for North American buyers.",
    pdfUrl: "",
    pdfLabel: "Download specification sheet (PDF)",
  },
};

export const DEFAULT_FAQ_SECTIONS = {
  hero: {
    eyebrow: "FAQ",
    title: "Export buyer questions, answered",
    description:
      "MOQs, sampling, lead times, shipping, payment, customization, and certifications—everything procurement teams ask before their first order.",
    imageUrl: "https://picsum.photos/seed/faq-hero/1920/800",
  },
  faqItems: defaultFaqItems as FaqItem[],
};

export const DEFAULT_CONTACT_SECTIONS = {
  hero: {
    eyebrow: "Get In Touch",
    title: "Speak with our export team",
    description:
      "Share your product requirements, quantities, and timeline. We respond to all B2B inquiries within one business day.",
    imageUrl: "https://picsum.photos/seed/contact-hero/1920/800",
  },
  catalog: {
    pdfUrl: "",
    pdfLabel: "Download Product Catalog",
  },
};

export const DEFAULT_PRODUCTS_SECTIONS = {
  hero: {
    eyebrow: "Export Catalogue",
    title: "Premium textiles for every channel",
    description:
      "Twelve product categories engineered for hospitality, retail, spa, and private label buyers. Each specification page includes GSM ranges, sizes, materials, customization, and packaging options.",
    imageUrl: "https://picsum.photos/seed/products-hero/1920/800",
  },
};

export const ALL_PAGE_SLUGS = [
  "home",
  "about",
  "manufacturing",
  "certifications",
  "private-label",
  "contact",
  "faq",
  "products",
] as const;

const STATIC_PAGES: Record<string, PageContentData> = {
  home: {
    slug: "home",
    metaTitle: siteConfig.name,
    metaDescription: siteConfig.description,
    sections: DEFAULT_HOME_SECTIONS,
  },
  about: {
    slug: "about",
    metaTitle: "About Us",
    metaDescription:
      "Learn about Mist & Haven Living—four decades of premium textile manufacturing in Solapur, India, exporting to USA and Canada.",
    sections: DEFAULT_ABOUT_SECTIONS,
  },
  manufacturing: {
    slug: "manufacturing",
    metaTitle: "Manufacturing",
    metaDescription:
      "Vertical textile manufacturing from yarn selection to export packaging. ISO-certified facility in Solapur, India serving USA and Canada buyers.",
    sections: DEFAULT_MANUFACTURING_SECTIONS,
  },
  certifications: {
    slug: "certifications",
    metaTitle: "Certifications",
    metaDescription:
      "ISO 9001:2015, OEKO-TEX Standard 100, BCI, GOTS, BSCI, and SEDEX/SMETA compliance for export textile manufacturing to USA and Canada.",
    sections: {},
  },
  "private-label": {
    slug: "private-label",
    metaTitle: "Private Label",
    metaDescription:
      "Launch or scale your towel and linen brand with full private label manufacturing—from product development to retail-ready packaging. Export to USA and Canada.",
    sections: DEFAULT_PRIVATE_LABEL_SECTIONS,
  },
  contact: {
    slug: "contact",
    metaTitle: "Contact",
    metaDescription:
      "Contact Mist & Haven Living export team for B2B textile inquiries. USA and Canada buyers welcome. Response within one business day.",
    sections: DEFAULT_CONTACT_SECTIONS,
  },
  faq: {
    slug: "faq",
    metaTitle: "FAQ",
    metaDescription:
      "Frequently asked questions about MOQs, samples, lead times, shipping, payment terms, customization, and certifications for Mist & Haven Living export buyers.",
    sections: DEFAULT_FAQ_SECTIONS,
  },
  products: {
    slug: "products",
    metaTitle: "Products",
    metaDescription:
      "Explore our full range of premium B2B textile products—bath towels, hotel linen, spa towels, private label, and more for USA and Canada export.",
    sections: DEFAULT_PRODUCTS_SECTIONS,
  },
};

function mergePageWithDefaults(row: {
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: unknown;
}): PageContentData {
  const fallback = STATIC_PAGES[row.slug];
  return {
    slug: row.slug,
    metaTitle: mergeStringField(
      fallback?.metaTitle ?? null,
      row.metaTitle,
    ) as string | null,
    metaDescription: mergeStringField(
      fallback?.metaDescription ?? null,
      row.metaDescription,
    ) as string | null,
    sections: deepMergeSections(
      fallback?.sections as Record<string, unknown> | undefined,
      row.sections,
    ),
  };
}

export async function getPageContent(
  slug: string,
): Promise<PageContentData | null> {
  if (!isDbConfigured()) {
    return STATIC_PAGES[slug] ?? null;
  }
  try {
    const row = await prisma.pageContent.findUnique({ where: { slug } });
    if (!row) return STATIC_PAGES[slug] ?? null;
    return mergePageWithDefaults(row);
  } catch {
    return STATIC_PAGES[slug] ?? null;
  }
}

export async function getAllPagesAdmin(): Promise<PageContentData[]> {
  if (!isDbConfigured()) {
    return ALL_PAGE_SLUGS.map((slug) => STATIC_PAGES[slug]).filter(Boolean);
  }
  try {
    const rows = await prisma.pageContent.findMany({ orderBy: { slug: "asc" } });
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    return ALL_PAGE_SLUGS.map((slug) => {
      const row = bySlug.get(slug);
      if (row) return mergePageWithDefaults(row);
      return STATIC_PAGES[slug];
    });
  } catch {
    return ALL_PAGE_SLUGS.map((slug) => STATIC_PAGES[slug]).filter(Boolean);
  }
}

export { STATIC_PAGES };
