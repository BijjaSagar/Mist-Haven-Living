import { inquirySchema } from "@/lib/validations/inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCategoryBySlug } from "@/lib/data/products";
import { getInquiryEmailConfig } from "@/lib/data/inquiry-config";
import {
  createInquiry,
  markInquiryEmailResult,
} from "@/lib/data/inquiries";
import { sendInquiryNotificationEmail } from "@/lib/inquiry/send-notification";
import { isDbConfigured } from "@/lib/db";
import { apiError, apiSuccess, apiZodError } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

function resolveSource(
  productInterest: string,
  request: Request,
): string {
  if (productInterest === "catalog-download") return "catalog";
  const referer = request.headers.get("referer") ?? "";
  if (referer.includes("/contact")) return "contact";
  if (referer.endsWith("/") || referer.match(/\/\?/)) return "home";
  return "web";
}

export const POST = withApiHandler(async (request) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return apiError(
        "Too many requests. Please try again later.",
        429,
        "RATE_LIMITED",
      );
    }

    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return apiZodError(parsed.error, "Invalid form data");
    }

    const data = parsed.data;

    if (data.website) {
      return apiSuccess({ accepted: true });
    }

    const emailConfig = await getInquiryEmailConfig();

    if (!emailConfig.inquiryEnabled) {
      return apiError(
        "Inquiry form is temporarily unavailable",
        503,
        "INQUIRY_DISABLED",
      );
    }

    if (!isDbConfigured()) {
      console.error("Inquiry submission failed: DATABASE_URL is not configured");
      return apiError(
        "Unable to save inquiry. Database is not configured.",
        503,
        "DATABASE_NOT_CONFIGURED",
      );
    }

    const product =
      data.productInterest === "catalog-download"
        ? null
        : await getCategoryBySlug(data.productInterest);
    const productLabel =
      data.productInterest === "catalog-download"
        ? "Product Catalog Download"
        : (product?.name ?? data.productInterest);

    const source = resolveSource(data.productInterest, request);

    const inquiry = await createInquiry({
      name: data.name,
      company: data.company,
      country: data.country,
      email: data.email,
      phone: data.phone,
      productInterest: data.productInterest,
      message: data.message,
      buyerType: data.buyerType,
      estimatedVolume: data.estimatedVolume,
      targetMarket: data.targetMarket,
      source,
    });

    const emailResult = await sendInquiryNotificationEmail(emailConfig, {
      name: data.name,
      company: data.company,
      buyerType: data.buyerType,
      estimatedVolume: data.estimatedVolume,
      targetMarket: data.targetMarket,
      country: data.country,
      email: data.email,
      phone: data.phone,
      productLabel,
      message: data.message,
    });

    await markInquiryEmailResult(
      inquiry.id,
      emailResult.ok,
      emailResult.ok
        ? null
        : [emailResult.code, emailResult.message, emailResult.detail]
            .filter(Boolean)
            .join(" — "),
    );

    if (!emailResult.ok) {
      console.error("Inquiry saved but email failed:", {
        inquiryId: inquiry.id,
        code: emailResult.code,
        message: emailResult.message,
        detail: emailResult.detail,
      });

      return apiSuccess({
        emailSent: false,
        warning:
          "Your inquiry was received and saved. Email notification could not be sent — our team will still follow up.",
      });
    }

    return apiSuccess({ emailSent: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Inquiry submission error:", { detail, error });
    return apiError(
      "Failed to save inquiry. Please try again or contact us directly.",
      500,
      "SUBMISSION_FAILED",
      process.env.NODE_ENV === "development" ? { details: detail } : undefined,
    );
  }
});
