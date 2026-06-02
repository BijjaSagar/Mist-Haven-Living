import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { mapProduct } from "@/lib/data/products";
import { apiError, apiSuccess } from "@/lib/api-response";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { slug } = await context.params;
  const product = await prisma.productCategory.findUnique({ where: { slug } });
  if (!product) {
    return apiError("Not found", 404, "NOT_FOUND");
  }
  return apiSuccess(mapProduct(product));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const product = await prisma.productCategory.update({
      where: { slug },
      data: {
        name: body.name,
        shortDescription: body.shortDescription,
        description: body.description,
        eyebrow: body.eyebrow,
        heroImage: body.heroImage,
        cardImage: body.cardImage,
        galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        features: body.features,
        materials: body.materials,
        sizes: body.sizes,
        gsmRange: body.gsmRange,
        customization: body.customization,
        packaging: body.packaging,
        idealFor: body.idealFor,
        leadTime: body.leadTime,
        moq: body.moq,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        sortOrder: body.sortOrder,
        visible: body.visible,
      },
    });
    await revalidateSite();
    return apiSuccess(mapProduct(product));
  } catch (error) {
    const message =
      error instanceof Error &&
      /Unknown column|galleryImages/i.test(error.message)
        ? "Database schema is out of date. Run: npx prisma migrate deploy"
        : "Failed to update product";
    return apiError(message, 500, "UPDATE_FAILED");
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { slug } = await context.params;

  try {
    await prisma.productCategory.delete({ where: { slug } });
    await revalidateSite();
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Failed to delete product", 500, "DELETE_FAILED");
  }
}
