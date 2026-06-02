import { Resend } from "resend";
import type { InquiryEmailConfig } from "@/lib/data/inquiry-config";

export type InquiryNotificationData = {
  name: string;
  company: string;
  buyerType: string;
  estimatedVolume?: string | null;
  targetMarket?: string | null;
  country: string;
  email: string;
  phone: string;
  productLabel: string;
  message: string;
};

export type SendInquiryEmailResult =
  | { ok: true }
  | { ok: false; code: string; message: string; detail?: string };

export function getEmailConfigIssues(
  config: InquiryEmailConfig,
): { code: string; message: string }[] {
  const issues: { code: string; message: string }[] = [];

  if (!config.resendKey) {
    issues.push({
      code: "MISSING_RESEND_KEY",
      message:
        "RESEND_API_KEY is not set in server environment (hPanel → Environment variables).",
    });
  }

  if (!config.leadsEmail) {
    issues.push({
      code: "MISSING_LEADS_EMAIL",
      message:
        "Leads inbox email is not set. Add it in Admin → Settings or set LEADS_TO_EMAIL env.",
    });
  }

  return issues;
}

export async function sendInquiryNotificationEmail(
  config: InquiryEmailConfig,
  data: InquiryNotificationData,
): Promise<SendInquiryEmailResult> {
  const issues = getEmailConfigIssues(config);
  if (issues.length > 0) {
    return {
      ok: false,
      code: issues.map((i) => i.code).join(","),
      message: issues.map((i) => i.message).join(" "),
    };
  }

  try {
    const resend = new Resend(config.resendKey!);
    const { error } = await resend.emails.send({
      from: config.resendFrom,
      to: config.leadsEmail!,
      replyTo: data.email,
      subject: `New B2B Inquiry: ${data.company} — ${data.productLabel}`,
      html: `
        <h2>New Export Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(data.company)}</p>
        <p><strong>Buyer Type:</strong> ${escapeHtml(data.buyerType)}</p>
        <p><strong>Estimated Volume:</strong> ${escapeHtml(data.estimatedVolume ?? "—")}</p>
        <p><strong>Target Market:</strong> ${escapeHtml(data.targetMarket ?? "—")}</p>
        <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Product Interest:</strong> ${escapeHtml(data.productLabel)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      return {
        ok: false,
        code: "RESEND_ERROR",
        message: "Resend rejected the email send request.",
        detail: error.message,
      };
    }

    return { ok: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      code: "EMAIL_SEND_FAILED",
      message: "Unexpected error while sending notification email.",
      detail,
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
