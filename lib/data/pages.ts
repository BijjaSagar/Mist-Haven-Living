import { prisma, isDbConfigured } from "@/lib/db";
import type { PageContentData } from "@/lib/types/cms";

const DEFAULT_HOME_SECTIONS = {
  hero: {
    eyebrow: "Deepam Textiles · Solapur, India",
    title: "Luxury In Every Thread.",
    subtitle:
      "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
    imageUrl: "https://picsum.photos/seed/mist-hero/1920/1200",
  },
  heritage: {
    eyebrow: "Our Heritage",
    title: "Crafted by Deepam Textiles, Solapur",
    description:
      "For over four decades, Deepam Textiles has been at the heart of India's premier terry towel manufacturing region. Mist & Haven Living is our export-facing brand—bringing institutional-grade quality and boutique-level finishing to North American buyers.",
    imageUrl: "https://picsum.photos/seed/deepam-factory/900/675",
  },
};

const DEFAULT_ABOUT_SECTIONS = {
  hero: {
    eyebrow: "Our Story",
    title: "Where heritage meets export excellence",
  },
  intro: {
    title: "Four decades of textile excellence",
    body: "Founded in 1982 in Solapur—India's renowned terry towel manufacturing hub—Deepam Textiles has grown from a regional producer to an export powerhouse serving buyers across North America and beyond.",
  },
};

const STATIC_PAGES: Record<string, PageContentData> = {
  home: {
    slug: "home",
    metaTitle: "Mist & Haven Living",
    metaDescription:
      "Premium B2B textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
    sections: DEFAULT_HOME_SECTIONS,
  },
  about: {
    slug: "about",
    metaTitle: "About Us",
    metaDescription:
      "Learn about Deepam Textiles and Mist & Haven Living—four decades of premium textile manufacturing in Solapur, India.",
    sections: DEFAULT_ABOUT_SECTIONS,
  },
};

export async function getPageContent(
  slug: string,
): Promise<PageContentData | null> {
  if (!isDbConfigured()) {
    return STATIC_PAGES[slug] ?? null;
  }
  try {
    const row = await prisma.pageContent.findUnique({ where: { slug } });
    if (!row) return STATIC_PAGES[slug] ?? null;
    return {
      slug: row.slug,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      sections: row.sections as Record<string, unknown>,
    };
  } catch {
    return STATIC_PAGES[slug] ?? null;
  }
}

export async function getAllPagesAdmin(): Promise<PageContentData[]> {
  if (!isDbConfigured()) return Object.values(STATIC_PAGES);
  try {
    const rows = await prisma.pageContent.findMany({ orderBy: { slug: "asc" } });
    return rows.map((r) => ({
      slug: r.slug,
      metaTitle: r.metaTitle,
      metaDescription: r.metaDescription,
      sections: r.sections as Record<string, unknown>,
    }));
  } catch {
    return Object.values(STATIC_PAGES);
  }
}

export { DEFAULT_HOME_SECTIONS, DEFAULT_ABOUT_SECTIONS, STATIC_PAGES };
