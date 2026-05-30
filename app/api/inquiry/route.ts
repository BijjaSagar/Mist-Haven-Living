import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/validations/inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCategoryBySlug } from "@/data/products";

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

    const leadsEmail = process.env.LEADS_TO_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (!leadsEmail || !resendKey) {
      console.error("Missing RESEND_API_KEY or LEADS_TO_EMAIL");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 },
      );
    }

    const product =
      data.productInterest === "catalog-download"
        ? null
        : getCategoryBySlug(data.productInterest);
    const productLabel =
      data.productInterest === "catalog-download"
        ? "Product Catalog Download"
        : (product?.name ?? data.productInterest);

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Mist & Haven Inquiries <onboarding@resend.dev>",
      to: leadsEmail,
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
