import { getSiteSettings } from "@/lib/data/site-settings";

const DEFAULT_FROM = "Mist & Haven Inquiries <onboarding@resend.dev>";

export type InquiryEmailConfig = {
  leadsEmail: string | null;
  resendFrom: string;
  resendKey: string | null;
  inquiryEnabled: boolean;
  configured: boolean;
};

export async function getInquiryEmailConfig(): Promise<InquiryEmailConfig> {
  const settings = await getSiteSettings();
  const leadsEmail =
    settings.leadsToEmail?.trim() ||
    settings.contactEmail?.trim() ||
    process.env.LEADS_TO_EMAIL?.trim() ||
    null;
  const resendFrom =
    settings.resendFromEmail?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    DEFAULT_FROM;
  const resendKey = process.env.RESEND_API_KEY?.trim() || null;
  const inquiryEnabled = settings.inquiryEnabled;

  return {
    leadsEmail,
    resendFrom,
    resendKey,
    inquiryEnabled,
    configured: Boolean(leadsEmail && resendKey && inquiryEnabled),
  };
}
