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

  const certs = await prisma.certification.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return apiSuccess(certs, { meta: listMeta(certs) });
});

export const POST = withApiHandler(async (request: NextRequest) => {
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
    return apiSuccess(cert, { status: 201 });
  } catch {
    return apiError("Failed to create certification", 500, "CREATE_FAILED");
  }
});

export const PUT = withApiHandler(async (request: NextRequest) => {
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
    return apiSuccess({ updated: true });
  } catch {
    return apiError("Failed to update certifications", 500, "UPDATE_FAILED");
  }
});
