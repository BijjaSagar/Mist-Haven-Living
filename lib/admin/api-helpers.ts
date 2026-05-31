import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/admin";

export async function requireAdmin(): Promise<
  { email: string } | NextResponse
> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export function isUnauthorized(
  result: { email: string } | NextResponse,
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
