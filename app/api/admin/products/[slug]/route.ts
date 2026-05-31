import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { mapProduct } from "@/lib/data/products";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { slug } = await context.params;
  const product = await prisma.productCategory.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(mapProduct(product));
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
    return NextResponse.json(mapProduct(product));
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { slug } = await context.params;

  try {
    await prisma.productCategory.delete({ where: { slug } });
    await revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
