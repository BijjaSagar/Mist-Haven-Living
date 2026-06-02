import { NextResponse } from "next/server";
import { getInquiryEmailConfig } from "@/lib/data/inquiry-config";
import { getEmailConfigIssues } from "@/lib/inquiry/send-notification";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const config = await getInquiryEmailConfig();
  const issues = getEmailConfigIssues(config);

  return NextResponse.json({
    inquiryEnabled: config.inquiryEnabled,
    hasResendKey: Boolean(config.resendKey),
    hasLeadsEmail: Boolean(config.leadsEmail),
    resendFrom: config.resendFrom,
    configured: config.configured,
    issues,
  });
}
