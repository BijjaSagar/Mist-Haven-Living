import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession, type AdminSession } from "@/lib/auth/admin";
import { apiError } from "@/lib/api-response";
import { isDbConfigured, prisma } from "@/lib/db";

export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return session;
}

export async function requireAdminRole(): Promise<AdminSession | NextResponse> {
  const session = await requireAdmin();
  if (isUnauthorized(session)) return session;
  if (session.role !== "admin") {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  return session;
}

export function isUnauthorized(
  result: AdminSession | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}

const SITE_PAGE_PATHS = [
  "/",
  "/about",
  "/products",
  "/manufacturing",
  "/certifications",
  "/private-label",
  "/faq",
  "/contact",
] as const;

/**
 * Bust ISR for all public routes after admin saves.
 * Layout revalidation is required so Header/Footer (logo, nav) refresh — page-only
 * revalidation leaves shared `(site)` layout segments stale for up to `revalidate`.
 */
export async function revalidateSite(): Promise<void> {
  console.log("[revalidateSite] Busting page + layout cache for site routes");

  revalidatePath("/", "layout");

  for (const path of SITE_PAGE_PATHS) {
    revalidatePath(path, "page");
  }

  revalidatePath("/products/[slug]", "page");

  if (isDbConfigured()) {
    try {
      const rows = await prisma.productCategory.findMany({
        select: { slug: true },
      });
      for (const { slug } of rows) {
        console.log("[revalidateSite] revalidating product page", { slug });
        revalidatePath(`/products/${slug}`, "page");
      }
    } catch (error) {
      console.error("[revalidateSite] failed to revalidate product slugs", error);
    }
  }
}
