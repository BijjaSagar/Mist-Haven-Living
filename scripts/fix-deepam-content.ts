import { PrismaClient } from "@prisma/client";
import {
  containsLegacyBrand,
  sanitizeLegacyBranding,
  sanitizeLegacyBrandingJson,
} from "../lib/branding";
import {
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_HOME_SECTIONS,
  STATIC_PAGES,
} from "../lib/data/pages";
import { STATIC_SETTINGS } from "../lib/data/site-settings";

const prisma = new PrismaClient();

const BRANDED_PAGE_SLUGS = new Set(["home", "about"]);

async function fixPageContent() {
  for (const slug of BRANDED_PAGE_SLUGS) {
    const page = STATIC_PAGES[slug];
    if (!page) continue;

    await prisma.pageContent.upsert({
      where: { slug },
      update: {
        sections:
          slug === "home" ? DEFAULT_HOME_SECTIONS : DEFAULT_ABOUT_SECTIONS,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
      },
      create: {
        slug,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        sections:
          slug === "home" ? DEFAULT_HOME_SECTIONS : DEFAULT_ABOUT_SECTIONS,
      },
    });
    console.log(`Updated ${slug} page sections to current branding defaults.`);
  }

  const pages = await prisma.pageContent.findMany();
  for (const page of pages) {
    if (BRANDED_PAGE_SLUGS.has(page.slug)) continue;

    const serialized = JSON.stringify({
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      sections: page.sections,
    });
    if (!containsLegacyBrand(serialized)) continue;

    await prisma.pageContent.update({
      where: { slug: page.slug },
      data: {
        metaTitle: page.metaTitle
          ? sanitizeLegacyBranding(page.metaTitle)
          : null,
        metaDescription: page.metaDescription
          ? sanitizeLegacyBranding(page.metaDescription)
          : null,
        sections: sanitizeLegacyBrandingJson(page.sections) as object,
      },
    });
    console.log(`Sanitized legacy branding in page: ${page.slug}`);
  }
}

async function fixSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    console.log("No SiteSettings row found; skipping.");
    return;
  }

  const textFields = [
    "siteName",
    "legalName",
    "tagline",
    "description",
    "footerBlurb",
    "copyrightText",
    "exportMarkets",
  ] as const;

  const updates: Partial<Record<(typeof textFields)[number], string>> = {};

  for (const field of textFields) {
    const value = settings[field];
    if (typeof value !== "string" || !containsLegacyBrand(value)) continue;

    const fallback = STATIC_SETTINGS[field as keyof typeof STATIC_SETTINGS];
    updates[field] =
      typeof fallback === "string" ? fallback : sanitizeLegacyBranding(value);
  }

  if (Object.keys(updates).length === 0) {
    console.log("SiteSettings: no legacy branding found.");
    return;
  }

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: updates,
  });
  console.log(`SiteSettings updated: ${Object.keys(updates).join(", ")}`);
}

async function main() {
  console.log("Fixing legacy Deepam branding in CMS content...");
  await fixPageContent();
  await fixSiteSettings();
  console.log("Branding fix completed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
