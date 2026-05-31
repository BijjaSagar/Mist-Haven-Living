import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/validations/inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCategoryBySlug } from "@/lib/data/products";
import { getInquiryEmailConfig } from "@/lib/data/inquiry-config";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.website) {
      return NextResponse.json({ success: true });
    }

    const emailConfig = await getInquiryEmailConfig();

    if (!emailConfig.inquiryEnabled) {
      return NextResponse.json(
        { error: "Inquiry form is temporarily unavailable" },
        { status: 503 },
      );
    }

    if (!emailConfig.configured) {
      console.error(
        "Inquiry email not configured: set RESEND_API_KEY and leads destination in Admin → Settings (or LEADS_TO_EMAIL env)",
      );
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 },
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

    const resend = new Resend(emailConfig.resendKey!);

    await resend.emails.send({
      from: emailConfig.resendFrom,
      to: emailConfig.leadsEmail!,
      replyTo: data.email,
      subject: `New B2B Inquiry: ${data.company} — ${productLabel}`,
      html: `
        <h2>New Export Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Buyer Type:</strong> ${data.buyerType ?? "—"}</p>
        <p><strong>Estimated Volume:</strong> ${data.estimatedVolume ?? "—"}</p>
        <p><strong>Target Market:</strong> ${data.targetMarket ?? "—"}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Product Interest:</strong> ${productLabel}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 },
    );
  }
}
