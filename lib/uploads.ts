import { existsSync } from "fs";
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

/**
 * Directory Next.js serves as `/public`.
 * Standalone deploys (`npm run start:standalone`) read static files from
 * `.next/standalone/public/`, not `public/` at the app root.
 */
export function resolvePublicDir(): string {
  const cwd = process.cwd();

  if (process.env.PUBLIC_DIR?.trim()) {
    return process.env.PUBLIC_DIR.trim();
  }

  const standaloneMarker = path.join(cwd, ".next", "standalone", "server.js");
  if (existsSync(standaloneMarker)) {
    return path.join(cwd, ".next", "standalone", "public");
  }

  // Flat standalone bundle (server.js at app root next to public/)
  if (
    existsSync(path.join(cwd, "server.js")) &&
    existsSync(path.join(cwd, "public"))
  ) {
    return path.join(cwd, "public");
  }

  return path.join(cwd, "public");
}

/** Resolve upload directory under public/uploads from a folder like `products/bath-towels`. */
export function resolveUploadDir(folder?: string): {
  diskPath: string;
  publicPrefix: string;
} {
  const base = path.join(resolvePublicDir(), "uploads");
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
