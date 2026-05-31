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

  const certs = await prisma.certification.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(certs);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const count = await prisma.certification.count();
    const cert = await prisma.certification.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description,
        pdfUrl: body.pdfUrl,
        sortOrder: body.sortOrder ?? count,
        visible: body.visible ?? true,
      },
    });
    await revalidateSite();
    return NextResponse.json(cert);
  } catch {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const items = body.items as Array<{
      id: string;
      name: string;
      code: string | null;
      description: string;
      pdfUrl: string | null;
      sortOrder: number;
      visible: boolean;
    }>;

    for (const item of items) {
      await prisma.certification.update({
        where: { id: item.id },
        data: {
          name: item.name,
          code: item.code,
          description: item.description,
          pdfUrl: item.pdfUrl,
          sortOrder: item.sortOrder,
          visible: item.visible,
        },
      });
    }

    await revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update certifications" }, { status: 500 });
  }
}
