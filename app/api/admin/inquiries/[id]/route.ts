import { NextRequest } from "next/server";
import {
  getInquiryById,
  markInquiryRead,
  markInquiryUnread,
} from "@/lib/data/inquiries";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withApiHandler, type RouteContext } from "@/lib/api-route";

export const GET = withApiHandler(
  async (_request: NextRequest, context: RouteContext) => {
    const auth = await requireAdmin();
    if (isUnauthorized(auth)) return auth;

    const { id } = await context.params;
    const inquiry = await getInquiryById(id);

    if (!inquiry) {
      return apiError("Inquiry not found", 404, "NOT_FOUND");
    }

    return apiSuccess(inquiry);
  },
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context: RouteContext) => {
    const auth = await requireAdmin();
    if (isUnauthorized(auth)) return auth;

    const { id } = await context.params;

    try {
      const body = await request.json();
      const read = body.read as boolean | undefined;

      if (read === true) {
        const inquiry = await markInquiryRead(id);
        return apiSuccess(inquiry);
      }

      if (read === false) {
        const inquiry = await markInquiryUnread(id);
        return apiSuccess(inquiry);
      }

      return apiError("Invalid update", 400, "VALIDATION_ERROR");
    } catch {
      return apiError("Failed to update inquiry", 500, "UPDATE_FAILED");
    }
  },
);
