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

  const items = await prisma.navigationItem.findMany({
    orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const item = await prisma.navigationItem.create({
      data: {
        label: body.label,
        href: body.href,
        type: body.type ?? "link",
        sortOrder: body.sortOrder ?? 0,
        visible: body.visible ?? true,
        location: body.location,
      },
    });
    await revalidateSite();
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const items = body.items as Array<{
      id: string;
      label: string;
      href: string;
      type: string;
      sortOrder: number;
      visible: boolean;
      location: string;
    }>;

    for (const item of items) {
      await prisma.navigationItem.update({
        where: { id: item.id },
        data: {
          label: item.label,
          href: item.href,
          type: item.type,
          sortOrder: item.sortOrder,
          visible: item.visible,
          location: item.location,
        },
      });
    }

    await revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update items" }, { status: 500 });
  }
}
