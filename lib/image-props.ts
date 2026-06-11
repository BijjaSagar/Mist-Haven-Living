/** User-uploaded assets under /public/uploads — skip Next image optimizer (standalone-safe). */
export function isUploadedAsset(src: string): boolean {
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/catalog/") ||
    src.startsWith("/certificates/")
  );
}

/** Timestamp embedded in upload filenames: `/uploads/.../1718123456789-abc123.png` */
const UPLOAD_FILENAME_TS_RE = /\/(\d{13})-[a-z0-9]+\.[a-z0-9]+$/i;

export type CacheVersion = string | number | Date | null | undefined;

function normalizeCacheVersion(version: CacheVersion): string | null {
  if (version == null || version === "") return null;
  if (version instanceof Date) return String(version.getTime());
  return String(version);
}

/**
 * Append `?v=` for CMS-managed local images so browsers/CDNs re-fetch after admin saves.
 * Upload paths already include a millisecond timestamp in the filename; static paths
 * (e.g. `/logo.png`) rely on the DB `updatedAt` passed as `cacheVersion`.
 */
export function cmsImageSrc(src: string, cacheVersion?: CacheVersion): string {
  if (!src || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.includes("?v=")) return src;

  const version =
    normalizeCacheVersion(cacheVersion) ??
    UPLOAD_FILENAME_TS_RE.exec(src)?.[1] ??
    null;

  if (!version) return src;

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${encodeURIComponent(version)}`;
}

export function imageOptsForSrc(src: string): { unoptimized?: boolean } {
  return isUploadedAsset(src) ? { unoptimized: true } : {};
}

export function resolveCmsImage(
  src: string,
  cacheVersion?: CacheVersion,
): { src: string; unoptimized?: boolean } {
  return {
    src: cmsImageSrc(src, cacheVersion),
    ...imageOptsForSrc(src),
  };
}
