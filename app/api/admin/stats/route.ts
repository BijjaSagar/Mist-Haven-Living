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

  const stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
  return apiSuccess(stats, { meta: listMeta(stats) });
});

export const POST = withApiHandler(async (request: NextRequest) => {
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
    return apiSuccess(stat, { status: 201 });
  } catch {
    return apiError("Failed to create stat", 500, "CREATE_FAILED");
  }
});

export const PUT = withApiHandler(async (request: NextRequest) => {
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
    return apiSuccess({ updated: true });
  } catch {
    return apiError("Failed to update stats", 500, "UPDATE_FAILED");
  }
});
