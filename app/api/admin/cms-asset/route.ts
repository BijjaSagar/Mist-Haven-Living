import { NextRequest, NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin/api-helpers";
import { apiError } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";
import { readCmsUploadFile } from "@/lib/cms-asset";

export const GET = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const pathParam = request.nextUrl.searchParams.get("path")?.trim();
  if (!pathParam) {
    console.log("[admin/cms-asset] missing path query param");
    return apiError("Missing path", 400, "VALIDATION_ERROR");
  }

  const result = await readCmsUploadFile(pathParam);
  if (!result.ok) {
    if (result.reason === "invalid_path") {
      return apiError("Invalid path", 400, "VALIDATION_ERROR");
    }
    return apiError("Not found", 404, "NOT_FOUND");
  }

  console.log("[admin/cms-asset] served file", {
    pathParam,
    diskPath: result.diskPath,
    bytes: result.buffer.length,
    contentType: result.contentType,
  });

  return new NextResponse(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "private, no-cache",
    },
  });
});
