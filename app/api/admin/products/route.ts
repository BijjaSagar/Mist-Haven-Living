import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { mapProduct } from "@/lib/data/products";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const products = await prisma.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const count = await prisma.productCategory.count();
    const product = await prisma.productCategory.create({
      data: {
        slug: body.slug,
        name: body.name,
        shortDescription: body.shortDescription,
        description: body.description,
        eyebrow: body.eyebrow ?? "",
        heroImage: body.heroImage ?? "",
        cardImage: body.cardImage ?? "",
        features: body.features ?? [],
        materials: body.materials ?? [],
        sizes: body.sizes ?? [],
        gsmRange: body.gsmRange ?? "",
        customization: body.customization ?? [],
        packaging: body.packaging ?? [],
        idealFor: body.idealFor ?? [],
        leadTime: body.leadTime ?? "",
        moq: body.moq ?? "",
        sortOrder: body.sortOrder ?? count,
        visible: body.visible ?? true,
      },
    });
    await revalidateSite();
    return NextResponse.json(mapProduct(product));
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
