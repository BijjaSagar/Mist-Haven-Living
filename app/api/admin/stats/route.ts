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

  const stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const count = await prisma.stat.count();
    const stat = await prisma.stat.create({
      data: {
        value: body.value,
        label: body.label,
        sortOrder: body.sortOrder ?? count,
        visible: body.visible ?? true,
      },
    });
    await revalidateSite();
    return NextResponse.json(stat);
  } catch {
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const items = body.items as Array<{
      id: string;
      value: string;
      label: string;
      sortOrder: number;
      visible: boolean;
    }>;

    for (const item of items) {
      await prisma.stat.update({
        where: { id: item.id },
        data: {
          value: item.value,
          label: item.label,
          sortOrder: item.sortOrder,
          visible: item.visible,
        },
      });
    }

    await revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
