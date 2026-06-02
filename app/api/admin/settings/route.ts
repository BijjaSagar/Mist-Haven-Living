import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { mapSettings } from "@/lib/data/site-settings";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const GET = withApiHandler(async () => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const row = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (!row) {
    return apiError("Settings not found", 404, "NOT_FOUND");
  }
  return apiSuccess(mapSettings(row));
});

export const PUT = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const colors = body.colors ?? {};

    const row = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        legalName: body.legalName,
        tagline: body.tagline,
        description: body.description,
        logoUrl: body.logoUrl,
        logoLightUrl: body.logoLightUrl,
        faviconUrl: body.faviconUrl,
        colorPearl: colors.pearl,
        colorOat: colors.oat,
        colorTaupe: colors.taupe,
        colorMuted: colors.muted,
        colorSage: colors.sage,
        colorSageDeep: colors.sageDeep,
        colorHairline: colors.hairline,
        contactEmail: body.contactEmail,
        contactEmailSecondary: body.contactEmailSecondary || null,
        contactPhone: body.contactPhone,
        leadsToEmail: body.leadsToEmail || null,
        resendFromEmail: body.resendFromEmail || null,
        inquiryEnabled: body.inquiryEnabled ?? true,
        whatsappNumber: body.whatsappNumber,
        calendlyUrl: body.calendlyUrl,
        footerBlurb: body.footerBlurb,
        copyrightText: body.copyrightText,
        exportMarkets: body.exportMarkets,
        addressStreet: body.address?.street,
        addressCity: body.address?.city,
        addressRegion: body.address?.region,
        addressCountry: body.address?.country,
        addressPostalCode: body.address?.postalCode,
      },
      create: {
        id: "default",
        siteName: body.siteName ?? "Mist & Haven Living",
        legalName: body.legalName ?? "Mist & Haven Living",
        tagline: body.tagline ?? "",
        description: body.description ?? "",
        logoUrl: body.logoUrl ?? "/logo.png",
        logoLightUrl: body.logoLightUrl ?? "/logo-light.png",
        faviconUrl: body.faviconUrl,
        colorPearl: colors.pearl ?? "#fbfaf6",
        colorOat: colors.oat ?? "#f1ece2",
        colorTaupe: colors.taupe ?? "#5e5547",
        colorMuted: colors.muted ?? "#857b6c",
        colorSage: colors.sage ?? "#c8c7ac",
        colorSageDeep: colors.sageDeep ?? "#9a9a7d",
        colorHairline: colors.hairline ?? "#e7e0d3",
        contactEmail: body.contactEmail ?? "",
        contactEmailSecondary: body.contactEmailSecondary || null,
        contactPhone: body.contactPhone ?? "",
        leadsToEmail: body.leadsToEmail || null,
        resendFromEmail: body.resendFromEmail || null,
        inquiryEnabled: body.inquiryEnabled ?? true,
        whatsappNumber: body.whatsappNumber,
        calendlyUrl: body.calendlyUrl,
        footerBlurb: body.footerBlurb ?? "",
        copyrightText: body.copyrightText,
        exportMarkets: body.exportMarkets ?? "USA · Canada",
        addressStreet: body.address?.street ?? "",
        addressCity: body.address?.city ?? "",
        addressRegion: body.address?.region ?? "",
        addressCountry: body.address?.country ?? "",
        addressPostalCode: body.address?.postalCode ?? "",
      },
    });

    await revalidateSite();
    return apiSuccess(mapSettings(row));
  } catch (error) {
    console.error("[admin/settings PUT]", error);
    const message =
      error instanceof Error &&
      /Unknown column|column.*does not exist|P2022/i.test(error.message)
        ? "Database schema is out of date. Run: npx prisma migrate deploy"
        : "Failed to save settings";
    return apiError(message, 500, "SAVE_FAILED");
  }
});
