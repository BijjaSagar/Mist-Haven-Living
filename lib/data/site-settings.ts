import type { SiteSettings } from "@prisma/client";
import { prisma, isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/lib/utils";
import type { SiteColors, SiteSettingsData } from "@/lib/types/cms";

const DEFAULT_COLORS: SiteColors = {
  pearl: "#fbfaf6",
  oat: "#f1ece2",
  taupe: "#5e5547",
  muted: "#857b6c",
  sage: "#c8c7ac",
  sageDeep: "#9a9a7d",
  hairline: "#e7e0d3",
};

const STATIC_SETTINGS: SiteSettingsData = {
  siteName: siteConfig.name,
  legalName: siteConfig.legalName,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  logoUrl: "/logo.png",
  logoLightUrl: "/logo-light.png",
  faviconUrl: null,
  colors: DEFAULT_COLORS,
  contactEmail: siteConfig.email,
  contactPhone: siteConfig.phone,
  leadsToEmail: process.env.LEADS_TO_EMAIL ?? null,
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? null,
  inquiryEnabled: true,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? null,
  footerBlurb:
    "Premium textile manufacturing for hospitality, retail, and private label buyers across the USA and Canada.",
  copyrightText: null,
  exportMarkets: "USA · Canada",
  address: { ...siteConfig.address },
};

function mapSettings(row: SiteSettings): SiteSettingsData {
  return {
    siteName: row.siteName,
    legalName: row.legalName,
    tagline: row.tagline,
    description: row.description,
    logoUrl: row.logoUrl,
    logoLightUrl: row.logoLightUrl,
    faviconUrl: row.faviconUrl,
    colors: {
      pearl: row.colorPearl,
      oat: row.colorOat,
      taupe: row.colorTaupe,
      muted: row.colorMuted,
      sage: row.colorSage,
      sageDeep: row.colorSageDeep,
      hairline: row.colorHairline,
    },
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    leadsToEmail: row.leadsToEmail,
    resendFromEmail: row.resendFromEmail,
    inquiryEnabled: row.inquiryEnabled,
    whatsappNumber: row.whatsappNumber,
    calendlyUrl: row.calendlyUrl,
    footerBlurb: row.footerBlurb,
    copyrightText: row.copyrightText,
    exportMarkets: row.exportMarkets,
    address: {
      street: row.addressStreet,
      city: row.addressCity,
      region: row.addressRegion,
      country: row.addressCountry,
      postalCode: row.addressPostalCode,
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  if (!isDbConfigured()) return STATIC_SETTINGS;
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) return STATIC_SETTINGS;
    return mapSettings(row);
  } catch {
    return STATIC_SETTINGS;
  }
}

export function colorsToCssVars(colors: SiteColors): Record<string, string> {
  return {
    "--pearl": colors.pearl,
    "--oat": colors.oat,
    "--taupe": colors.taupe,
    "--muted": colors.muted,
    "--sage": colors.sage,
    "--sage-deep": colors.sageDeep,
    "--hairline": colors.hairline,
  };
}

export { DEFAULT_COLORS, STATIC_SETTINGS, mapSettings };
