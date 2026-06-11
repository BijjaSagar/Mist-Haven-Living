import { NextRequest, NextResponse } from "next/server";
import { readCmsUploadFile } from "@/lib/cms-asset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve CMS uploads from persistent storage when `public/uploads/` is not symlinked
 * (Hostinger flat deploy). Matches the write path used by POST /api/admin/upload.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    console.log("[uploads/route] missing path segments");
    return new NextResponse("Not found", { status: 404 });
  }

  const publicPath = `/uploads/${segments.map(decodeURIComponent).join("/")}`;
  const result = await readCmsUploadFile(publicPath);

  if (!result.ok) {
    console.log("[uploads/route] serve failed", { publicPath, reason: result.reason });
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
