import path from "path";

/** Safe path segment for upload subfolders (product slug, etc.). */
export function sanitizeUploadSegment(segment: string): string {
  const cleaned = segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "misc";
}

/** Resolve upload directory under public/uploads from a folder like `products/bath-towels`. */
export function resolveUploadDir(folder?: string): {
  diskPath: string;
  publicPrefix: string;
} {
  const base = path.join(process.cwd(), "public", "uploads");
  if (!folder?.trim()) {
    return { diskPath: base, publicPrefix: "/uploads" };
  }

  const parts = folder
    .split("/")
    .map((p) => sanitizeUploadSegment(p))
    .filter(Boolean);

  const diskPath = path.join(base, ...parts);
  const publicPrefix = `/uploads/${parts.join("/")}`;
  return { diskPath, publicPrefix };
}
