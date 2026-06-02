import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { apiError, apiSuccess, listMeta } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const GET = withApiHandler(async () => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const pages = await prisma.pageContent.findMany({ orderBy: { slug: "asc" } });
  return apiSuccess(pages, { meta: listMeta(pages) });
});

export const PUT = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const page = await prisma.pageContent.upsert({
      where: { slug: body.slug },
      update: {
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        sections: body.sections,
      },
      create: {
        slug: body.slug,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        sections: body.sections ?? {},
      },
    });
    await revalidateSite();
    return apiSuccess(page);
  } catch {
    return apiError("Failed to save page", 500, "SAVE_FAILED");
  }
});
