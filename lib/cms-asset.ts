import { access, readFile } from "fs/promises";
import path from "path";
import { sanitizeCmsImagePath } from "@/lib/image-props";
import { resolveUploadsStorageDir } from "@/lib/uploads";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  gif: "image/gif",
  ico: "image/x-icon",
  pdf: "application/pdf",
};

/** Normalize stored CMS paths to absolute `/uploads/...` URLs. */
export function normalizeCmsUploadPath(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return sanitizeCmsImagePath(withSlash);
}

/** Map a public `/uploads/...` URL to the on-disk CMS storage path. */
export function resolveCmsUploadDiskPath(publicPath: string): string | null {
  const pathname = normalizeCmsUploadPath(publicPath);
  if (!pathname.startsWith("/uploads/")) {
    console.log("[cms-asset] rejected non-upload path", { publicPath, pathname });
    return null;
  }

  const relative = pathname.slice("/uploads/".length);
  if (!relative) {
    console.log("[cms-asset] rejected empty relative path", { pathname });
    return null;
  }

  const segments = relative.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    console.log("[cms-asset] rejected traversal segment", { pathname, segments });
    return null;
  }

  const base = resolveUploadsStorageDir();
  const diskPath = path.join(base, ...segments);
  const resolved = path.resolve(diskPath);
  const resolvedBase = path.resolve(base);
  const withinBase =
    resolved === resolvedBase || resolved.startsWith(`${resolvedBase}${path.sep}`);

  if (!withinBase) {
    console.log("[cms-asset] rejected path outside storage root", {
      pathname,
      resolved,
      resolvedBase,
    });
    return null;
  }

  console.log("[cms-asset] resolved disk path", { pathname, resolved });
  return resolved;
}

export function mimeTypeForCmsAsset(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

export async function cmsUploadFileExists(publicPath: string): Promise<boolean> {
  const diskPath = resolveCmsUploadDiskPath(publicPath);
  if (!diskPath) return false;
  try {
    await access(diskPath);
    return true;
  } catch {
    console.log("[cms-asset] file missing on disk", { publicPath, diskPath });
    return false;
  }
}

export type CmsUploadServeResult =
  | { ok: true; buffer: Buffer; contentType: string; diskPath: string }
  | { ok: false; reason: "invalid_path" | "not_found" };

/** Read a CMS upload from persistent storage (same dir as POST /api/admin/upload). */
export async function readCmsUploadFile(
  publicPath: string,
): Promise<CmsUploadServeResult> {
  const diskPath = resolveCmsUploadDiskPath(publicPath);
  if (!diskPath) {
    console.log("[cms-asset] read rejected invalid path", { publicPath });
    return { ok: false, reason: "invalid_path" };
  }

  try {
    const buffer = await readFile(diskPath);
    const contentType = mimeTypeForCmsAsset(diskPath);
    console.log("[cms-asset] read ok", {
      publicPath,
      diskPath,
      bytes: buffer.length,
      contentType,
    });
    return { ok: true, buffer, contentType, diskPath };
  } catch (error) {
    console.error("[cms-asset] read failed", { publicPath, diskPath, error });
    return { ok: false, reason: "not_found" };
  }
}
