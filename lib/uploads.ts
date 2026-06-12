import { existsSync, lstatSync, realpathSync } from "fs";
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
 * Flat Hostinger deploy: server.js + public/ at app root (e.g. ~/domains/.../nodejs).
 * Uploads must live OUTSIDE this folder so deploy zip never wipes CMS files.
 */
export function isFlatStandaloneDeploy(cwd = process.cwd()): boolean {
  return (
    existsSync(path.join(cwd, "server.js")) &&
    existsSync(path.join(cwd, "public"))
  );
}

/** Pre-built standalone bundle (flat or nested) — production Hostinger deploy. */
export function isStandaloneDeploy(cwd = process.cwd()): boolean {
  return (
    isFlatStandaloneDeploy(cwd) ||
    existsSync(path.join(cwd, ".next", "standalone", "server.js"))
  );
}

/** Default persistent dir: sibling of app root, e.g. ~/domains/mistandhaven.com/uploads-data */
export function defaultPersistentUploadsDir(cwd = process.cwd()): string {
  return path.resolve(cwd, "..", "uploads-data");
}

/**
 * Directory Next.js serves as `/public`.
 * Standalone deploys (`npm run start:standalone`) read static files from
 * `.next/standalone/public/`, not `public/` at the app root.
 */
export function resolvePublicDir(): string {
  const cwd = process.cwd();

  if (process.env.PUBLIC_DIR?.trim()) {
    const dir = process.env.PUBLIC_DIR.trim();
    console.log("[uploads] resolvePublicDir from PUBLIC_DIR", { dir });
    return dir;
  }

  const standaloneMarker = path.join(cwd, ".next", "standalone", "server.js");
  if (existsSync(standaloneMarker)) {
    const dir = path.join(cwd, ".next", "standalone", "public");
    console.log("[uploads] resolvePublicDir standalone (app root cwd)", { cwd, dir });
    return dir;
  }

  // Flat standalone bundle (server.js at app root next to public/)
  if (isFlatStandaloneDeploy(cwd)) {
    const dir = path.join(cwd, "public");
    console.log("[uploads] resolvePublicDir flat standalone cwd", { cwd, dir });
    return dir;
  }

  const dir = path.join(cwd, "public");
  console.log("[uploads] resolvePublicDir default public/", { cwd, dir });
  return dir;
}

/**
 * Persistent CMS upload storage — survives deploy zip overwrites.
 *
 * Priority: PERSISTENT_UPLOADS_PATH → UPLOADS_DIR → (Hostinger) ../uploads-data
 * → dev default public/uploads.
 */
export function resolveUploadsStorageDir(): string {
  const envPath =
    process.env.PERSISTENT_UPLOADS_PATH?.trim() ||
    process.env.UPLOADS_DIR?.trim();
  if (envPath) {
    const resolved = path.resolve(envPath);
    console.log("[uploads] resolveUploadsStorageDir from env", { resolved });
    return resolved;
  }

  const cwd = process.cwd();
  const publicDir = resolvePublicDir();
  const publicUploads = path.join(publicDir, "uploads");
  const flatPublicUploads = path.join(cwd, "public", "uploads");

  for (const candidate of [publicUploads, flatPublicUploads]) {
    if (!existsSync(candidate)) continue;
    try {
      const stat = lstatSync(candidate);
      if (stat.isSymbolicLink()) {
        const target = realpathSync(candidate);
        console.log("[uploads] resolveUploadsStorageDir via public/uploads symlink", {
          candidate,
          target,
        });
        return target;
      }
    } catch (error) {
      console.error("[uploads] resolveUploadsStorageDir symlink read failed", {
        candidate,
        error,
      });
    }
  }

  if (isStandaloneDeploy(cwd)) {
    const persistent = defaultPersistentUploadsDir(cwd);
    console.log("[uploads] resolveUploadsStorageDir standalone default (outside deploy dir)", {
      cwd,
      persistent,
      layout: isFlatStandaloneDeploy(cwd) ? "flat" : "nested",
    });
    return persistent;
  }

  console.log("[uploads] resolveUploadsStorageDir dev public/uploads", {
    publicUploads,
  });
  return publicUploads;
}

/** Resolve upload directory from a folder like `products/bath-towels`. */
export function resolveUploadDir(folder?: string): {
  diskPath: string;
  publicPrefix: string;
} {
  const base = resolveUploadsStorageDir();
  if (!folder?.trim()) {
    console.log("[uploads] resolveUploadDir root", { diskPath: base });
    return { diskPath: base, publicPrefix: "/uploads" };
  }

  const parts = folder
    .split("/")
    .map((p) => sanitizeUploadSegment(p))
    .filter(Boolean);

  const diskPath = path.join(base, ...parts);
  const publicPrefix = `/uploads/${parts.join("/")}`;
  console.log("[uploads] resolveUploadDir", { folder, diskPath, publicPrefix });
  return { diskPath, publicPrefix };
}
