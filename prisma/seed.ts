import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  productCategories,
  companyStats,
  certifications,
} from "../data/products";
import {
  STATIC_HEADER,
  STATIC_FOOTER_COMPANY,
  STATIC_FOOTER_EXPORT,
} from "../lib/data/navigation";
import {
  DEFAULT_HOME_SECTIONS,
  DEFAULT_ABOUT_SECTIONS,
  STATIC_PAGES,
} from "../lib/data/pages";
import { siteConfig } from "../lib/utils";
import { DEFAULT_COLORS } from "../lib/data/site-settings";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: siteConfig.name,
      legalName: siteConfig.legalName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      logoUrl: "/logo.png",
      logoLightUrl: "/logo-light.png",
      colorPearl: DEFAULT_COLORS.pearl,
      colorOat: DEFAULT_COLORS.oat,
      colorTaupe: DEFAULT_COLORS.taupe,
      colorMuted: DEFAULT_COLORS.muted,
      colorSage: DEFAULT_COLORS.sage,
      colorSageDeep: DEFAULT_COLORS.sageDeep,
      colorHairline: DEFAULT_COLORS.hairline,
      contactEmail: siteConfig.email,
      contactEmailSecondary: siteConfig.emailSecondary,
      contactPhone: siteConfig.phone,
      leadsToEmail: process.env.LEADS_TO_EMAIL ?? siteConfig.leadsEmail,
      resendFromEmail: process.env.RESEND_FROM_EMAIL ?? null,
      inquiryEnabled: true,
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? null,
      footerBlurb:
        "Premium textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
      exportMarkets: "USA · Canada",
      addressStreet: siteConfig.address.street,
      addressCity: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
      addressPostalCode: siteConfig.address.postalCode,
    },
  });

  await prisma.navigationItem.deleteMany({});
  const navItems = [
    ...STATIC_HEADER,
    ...STATIC_FOOTER_COMPANY,
    ...STATIC_FOOTER_EXPORT,
  ];
  for (const item of navItems) {
    await prisma.navigationItem.create({
      data: {
        label: item.label,
        href: item.href,
        type: item.type,
        sortOrder: item.sortOrder,
        visible: item.visible,
        location: item.location,
      },
    });
  }

  await prisma.productCategory.deleteMany({});
  for (const [index, product] of productCategories.entries()) {
    await prisma.productCategory.create({
      data: {
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        eyebrow: product.eyebrow,
        heroImage: product.heroImage,
        cardImage: product.cardImage,
        galleryImages: [],
        features: product.features,
        materials: product.materials,
        sizes: product.sizes,
        gsmRange: product.gsmRange,
        customization: product.customization,
        packaging: product.packaging,
        idealFor: product.idealFor,
        leadTime: product.leadTime,
        moq: product.moq,
        sortOrder: index,
        visible: true,
      },
    });
  }

  await prisma.stat.deleteMany({});
  for (const [index, stat] of companyStats.entries()) {
    await prisma.stat.create({
      data: {
        value: stat.value,
        label: stat.label,
        sortOrder: index,
        visible: true,
      },
    });
  }

  await prisma.certification.deleteMany({});
  for (const [index, cert] of certifications.entries()) {
    await prisma.certification.create({
      data: {
        name: cert.name,
        code: cert.certificateNumber ?? null,
        description: cert.description,
        pdfUrl: cert.pdfUrl ?? null,
        sortOrder: index,
        visible: true,
      },
    });
  }

  const pages = [
    {
      slug: "home",
      metaTitle: siteConfig.name,
      metaDescription: siteConfig.description,
      sections: DEFAULT_HOME_SECTIONS,
    },
    {
      slug: "about",
      metaTitle: "About Us",
      metaDescription:
        "Learn about Mist & Haven Living—four decades of premium textile manufacturing in Solapur, India, exporting to USA and Canada.",
      sections: DEFAULT_ABOUT_SECTIONS,
    },
    {
      slug: "manufacturing",
      metaTitle: "Manufacturing",
      metaDescription:
        "Vertical textile manufacturing from yarn selection to export packaging. ISO-certified facility in Solapur, India serving USA and Canada buyers.",
      sections: {},
    },
    {
      slug: "certifications",
      metaTitle: "Certifications",
      metaDescription:
        "ISO 9001:2015, OEKO-TEX Standard 100, BCI, GOTS, BSCI, and SEDEX/SMETA compliance for export textile manufacturing to USA and Canada.",
      sections: {},
    },
    {
      slug: "private-label",
      metaTitle: "Private Label",
      metaDescription:
        "Launch or scale your towel and linen brand with full private label manufacturing—from product development to retail-ready packaging. Export to USA and Canada.",
      sections: STATIC_PAGES["private-label"].sections,
    },
    {
      slug: "contact",
      metaTitle: "Contact",
      metaDescription:
        "Contact Mist & Haven Living export team for B2B textile inquiries. USA and Canada buyers welcome. Response within one business day.",
      sections: STATIC_PAGES.contact.sections,
    },
    {
      slug: "faq",
      metaTitle: "FAQ",
      metaDescription:
        "Frequently asked questions about MOQs, samples, lead times, shipping, payment terms, customization, and certifications for Mist & Haven Living export buyers.",
      sections: {},
    },
    {
      slug: "products",
      metaTitle: "Products",
      metaDescription:
        "Explore our full range of premium B2B textile products—bath towels, hotel linen, spa towels, private label, and more for USA and Canada export.",
      sections: {},
    },
  ];

  for (const page of pages) {
    const refreshBrandedSections =
      page.slug === "home" || page.slug === "about";
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: refreshBrandedSections
        ? {
            sections: page.sections as Prisma.InputJsonValue,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
          }
        : {},
      create: {
        ...page,
        sections: page.sections as Prisma.InputJsonValue,
      },
    });
  }

  // Default admin: admin@mistandhaven.com / changeme123 — see DEPLOYMENT.md
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@mistandhaven.com"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Default Admin",
        role: "admin",
        active: true,
      },
    });
    console.log(`Created default admin user: ${adminEmail}`);
  } else if (process.env.ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.update({
      where: { email: adminEmail },
      data: { password: hashedPassword, active: true },
    });
    console.log(`Updated admin password for: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
