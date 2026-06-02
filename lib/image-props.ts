/** User-uploaded assets under /public/uploads — skip Next image optimizer (standalone-safe). */
export function isUploadedAsset(src: string): boolean {
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/catalog/") ||
    src.startsWith("/certificates/")
  );
}

export function imageOptsForSrc(src: string): { unoptimized?: boolean } {
  return isUploadedAsset(src) ? { unoptimized: true } : {};
}
