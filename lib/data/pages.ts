import { prisma, isDbConfigured } from "@/lib/db";
import type { PageContentData } from "@/lib/types/cms";
import { siteConfig } from "@/lib/utils";

const DEFAULT_HOME_SECTIONS = {
  hero: {
    eyebrow: "Mist & Haven Living · Solapur, India",
    title: "Luxury In Every Thread.",
    subtitle:
      "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
    imageUrl: "https://picsum.photos/seed/mist-hero/1920/1200",
  },
  heritage: {
    eyebrow: "Our Heritage",
    title: "Crafted in Solapur, India",
    description:
      "For over four decades, Mist & Haven Living has been at the heart of India's premier terry towel manufacturing region—bringing institutional-grade quality and boutique-level finishing to North American buyers.",
    imageUrl: "https://picsum.photos/seed/mist-factory/900/675",
  },
};

const DEFAULT_ABOUT_SECTIONS = {
  hero: {
    eyebrow: "Our Story",
    title: "Where heritage meets export excellence",
  },
  intro: {
    title: "Four decades of textile excellence",
    body: "Founded in 1982 in Solapur—India's renowned terry towel manufacturing hub—Mist & Haven Living has grown from a regional producer to an export powerhouse serving buyers across North America and beyond.",
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
    sections: {},
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
    sections: {},
  },
  contact: {
    slug: "contact",
    metaTitle: "Contact",
    metaDescription:
      "Contact Mist & Haven Living export team for B2B textile inquiries. USA and Canada buyers welcome. Response within one business day.",
    sections: {},
  },
  faq: {
    slug: "faq",
    metaTitle: "FAQ",
    metaDescription:
      "Frequently asked questions about MOQs, samples, lead times, shipping, payment terms, customization, and certifications for Mist & Haven Living export buyers.",
    sections: {},
  },
  products: {
    slug: "products",
    metaTitle: "Products",
    metaDescription:
      "Explore our full range of premium B2B textile products—bath towels, hotel linen, spa towels, private label, and more for USA and Canada export.",
    sections: {},
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
    metaTitle: row.metaTitle ?? fallback?.metaTitle ?? null,
    metaDescription: row.metaDescription ?? fallback?.metaDescription ?? null,
    sections: (row.sections ?? fallback?.sections ?? {}) as Record<
      string,
      unknown
    >,
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

export { DEFAULT_HOME_SECTIONS, DEFAULT_ABOUT_SECTIONS, STATIC_PAGES };
