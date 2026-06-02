import { getInquiryEmailConfig } from "@/lib/data/inquiry-config";
import { getEmailConfigIssues } from "@/lib/inquiry/send-notification";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";
import { apiSuccess } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const GET = withApiHandler(async () => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const config = await getInquiryEmailConfig();
  const issues = getEmailConfigIssues(config);

  return apiSuccess({
    inquiryEnabled: config.inquiryEnabled,
    hasResendKey: Boolean(config.resendKey),
    hasLeadsEmail: Boolean(config.leadsEmail),
    resendFrom: config.resendFrom,
    configured: config.configured,
    issues,
  });
});
