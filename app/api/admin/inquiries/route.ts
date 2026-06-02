import { getAllInquiriesAdmin } from "@/lib/data/inquiries";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";
import { apiSuccess, listMeta } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const GET = withApiHandler(async () => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const inquiries = await getAllInquiriesAdmin();
  return apiSuccess(inquiries, { meta: listMeta(inquiries) });
});
