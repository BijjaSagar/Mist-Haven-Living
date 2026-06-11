import type { SiteSettings } from "@prisma/client";
import { mergeStringField } from "@/lib/branding";
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
  contactEmailSecondary: siteConfig.emailSecondary,
  contactPhone: siteConfig.phone,
  leadsToEmail: process.env.LEADS_TO_EMAIL ?? siteConfig.leadsEmail,
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
    siteName: mergeStringField(STATIC_SETTINGS.siteName, row.siteName) as string,
    legalName: mergeStringField(STATIC_SETTINGS.legalName, row.legalName) as string,
    tagline: mergeStringField(STATIC_SETTINGS.tagline, row.tagline) as string,
    description: mergeStringField(
      STATIC_SETTINGS.description,
      row.description,
    ) as string,
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
    contactEmailSecondary: row.contactEmailSecondary,
    contactPhone: row.contactPhone,
    leadsToEmail: row.leadsToEmail,
    resendFromEmail: row.resendFromEmail,
    inquiryEnabled: row.inquiryEnabled,
    whatsappNumber: row.whatsappNumber,
    calendlyUrl: row.calendlyUrl,
    footerBlurb: mergeStringField(
      STATIC_SETTINGS.footerBlurb,
      row.footerBlurb,
    ) as string,
    copyrightText: row.copyrightText
      ? (mergeStringField(
          STATIC_SETTINGS.copyrightText,
          row.copyrightText,
        ) as string | null)
      : null,
    exportMarkets: mergeStringField(
      STATIC_SETTINGS.exportMarkets,
      row.exportMarkets,
    ) as string,
    address: {
      street: row.addressStreet,
      city: row.addressCity,
      region: row.addressRegion,
      country: row.addressCountry,
      postalCode: row.addressPostalCode,
    },
    updatedAt: row.updatedAt.toISOString(),
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
