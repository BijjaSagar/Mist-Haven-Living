import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession, type AdminSession } from "@/lib/auth/admin";

export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireAdminRole(): Promise<AdminSession | NextResponse> {
  const session = await requireAdmin();
  if (isUnauthorized(session)) return session;
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export function isUnauthorized(
  result: AdminSession | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}

export async function revalidateSite(): Promise<void> {
  const paths = [
    "/",
    "/about",
    "/products",
    "/manufacturing",
    "/certifications",
    "/private-label",
    "/faq",
    "/contact",
  ];
  for (const path of paths) {
    revalidatePath(path);
  }
  revalidatePath("/products/[slug]", "page");
}
