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

  const items = await prisma.navigationItem.findMany({
    orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
  });
  return apiSuccess(items, { meta: listMeta(items) });
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

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
  return apiSuccess(item, { status: 201 });
});

export const PUT = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

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
  return apiSuccess({ updated: true });
});
