import { NextRequest, NextResponse } from "next/server";
import {
  getInquiryById,
  markInquiryRead,
  markInquiryUnread,
} from "@/lib/data/inquiries";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await params;
  const inquiry = await getInquiryById(id);

  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  return NextResponse.json(inquiry);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await params;

  try {
    const body = await request.json();
    const read = body.read as boolean | undefined;

    if (read === true) {
      const inquiry = await markInquiryRead(id);
      return NextResponse.json(inquiry);
    }

    if (read === false) {
      const inquiry = await markInquiryUnread(id);
      return NextResponse.json(inquiry);
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
