import { NextResponse } from "next/server";
import { getAllInquiriesAdmin } from "@/lib/data/inquiries";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const inquiries = await getAllInquiriesAdmin();
  return NextResponse.json(inquiries);
}
