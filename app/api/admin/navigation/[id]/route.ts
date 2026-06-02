import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  isUnauthorized,
  requireAdmin,
  revalidateSite,
} from "@/lib/admin/api-helpers";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withApiHandler, type RouteContext } from "@/lib/api-route";

export const DELETE = withApiHandler(
  async (_request: NextRequest, context: RouteContext) => {
    const auth = await requireAdmin();
    if (isUnauthorized(auth)) return auth;

    const { id } = await context.params;

    try {
      await prisma.navigationItem.delete({ where: { id } });
      await revalidateSite();
      return apiSuccess({ deleted: true });
    } catch {
      return apiError("Failed to delete item", 500, "DELETE_FAILED");
    }
  },
);
