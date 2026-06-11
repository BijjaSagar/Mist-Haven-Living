import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { mapProduct } from "@/lib/data/products";
import { coalesceCardImageForSave } from "@/lib/image-props";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withApiHandler, type RouteContext } from "@/lib/api-route";

export const GET = withApiHandler(
  async (_request: NextRequest, context: RouteContext) => {
    const auth = await requireAdmin();
    if (isUnauthorized(auth)) return auth;

    const { slug } = await context.params;
    const product = await prisma.productCategory.findUnique({ where: { slug } });
    if (!product) {
      return apiError("Not found", 404, "NOT_FOUND");
    }
    return apiSuccess(mapProduct(product));
  },
);

export const PUT = withApiHandler(
  async (request: NextRequest, context: RouteContext) => {
    const auth = await requireAdmin();
    if (isUnauthorized(auth)) return auth;

    const { slug } = await context.params;

    try {
      const body = await request.json();
      const galleryImages = Array.isArray(body.galleryImages)
        ? body.galleryImages
        : [];
      const cardImage = coalesceCardImageForSave({
        cardImage: body.cardImage ?? "",
        heroImage: body.heroImage ?? "",
        galleryImages,
      });

      console.log("[admin/products PUT] persisting product images", {
        slug,
        cardImage,
        heroImage: body.heroImage,
        galleryCount: galleryImages.length,
      });

      const product = await prisma.productCategory.update({
        where: { slug },
        data: {
          name: body.name,
          shortDescription: body.shortDescription,
          description: body.description,
          eyebrow: body.eyebrow,
          heroImage: body.heroImage,
          cardImage,
          galleryImages,
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
  },
);

export const DELETE = withApiHandler(
  async (_request: NextRequest, context: RouteContext) => {
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
  },
);
