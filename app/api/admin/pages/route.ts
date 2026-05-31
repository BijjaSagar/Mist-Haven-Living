import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const pages = await prisma.pageContent.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json(pages);
}

export async function PUT(request: NextRequest) {
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
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
