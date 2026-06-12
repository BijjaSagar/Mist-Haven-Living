/** User-uploaded assets under /public/uploads — skip Next image optimizer (standalone-safe). */
function logCmsImage(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export function isUploadedAsset(src: string): boolean {
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/catalog/") ||
    src.startsWith("/certificates/")
  );
}

/** Seed / demo URLs that should not override CMS uploads on product cards. */
export function isPlaceholderImage(src: string): boolean {
  return /^https:\/\/(fastly\.)?picsum\.photos\//i.test(src.trim());
}

type ProductImageFields = {
  cardImage: string;
  heroImage: string;
  galleryImages?: string[];
};

/**
 * Pick the best image for product grid cards.
 * Prefers uploaded `cardImage`; falls back to hero/gallery when card is empty or picsum.
 */
export function resolveProductCardImage(category: ProductImageFields): string {
  const { cardImage, heroImage, galleryImages = [] } = category;
  const card = cardImage?.trim() ?? "";
  const hero = heroImage?.trim() ?? "";

  console.log("[resolveProductCardImage]", {
    card,
    hero,
    galleryCount: galleryImages.length,
  });

  if (card && isUploadedAsset(card)) return card;
  if (card && !isPlaceholderImage(card)) return card;
  if (hero && isUploadedAsset(hero)) {
    console.log("[resolveProductCardImage] using heroImage fallback", { hero });
    return hero;
  }
  const galleryUpload = galleryImages.find(
    (src) => typeof src === "string" && isUploadedAsset(src.trim()),
  );
  if (galleryUpload) {
    console.log("[resolveProductCardImage] using gallery fallback", {
      galleryUpload,
    });
    return galleryUpload;
  }
  return card || hero;
}

/**
 * When saving a product, persist the best card thumbnail if the editor still has
 * a seed/empty `cardImage` but hero or gallery uploads exist.
 */
export function coalesceCardImageForSave(fields: ProductImageFields): string {
  const card = fields.cardImage?.trim() ?? "";
  if (card && isUploadedAsset(card)) return card;
  if (card && !isPlaceholderImage(card)) return card;

  const resolved = resolveProductCardImage(fields);
  if (isUploadedAsset(resolved)) {
    console.log("[coalesceCardImageForSave] upgrading cardImage on save", {
      from: card || "(empty)",
      to: resolved,
    });
    return resolved;
  }

  console.log("[coalesceCardImageForSave] keeping seed cardImage", { card });
  return card;
}

/**
 * When gallery/hero uploads exist but `cardImage` is still a seed placeholder,
 * return the upgraded path so callers can persist it once (read-time backfill).
 */
export function staleCardImageUpgrade(
  fields: ProductImageFields,
): string | null {
  const current = fields.cardImage?.trim() ?? "";
  const upgraded = coalesceCardImageForSave(fields);
  if (upgraded !== current && isUploadedAsset(upgraded)) {
    console.log("[staleCardImageUpgrade] picsum card can be upgraded", {
      from: current || "(empty)",
      to: upgraded,
    });
    return upgraded;
  }
  return null;
}

/** Timestamp embedded in upload filenames: `/uploads/.../1718123456789-abc123.png` */
const UPLOAD_FILENAME_TS_RE = /\/(\d{13})-[a-z0-9]+\.[a-z0-9]+$/i;

/** Legacy bug: ISO time fragment merged into path instead of `?v=` query. */
const CORRUPTED_PATH_TS_RE =
  /_\d{2}(?:%3A|:)\d{2}(?:%3A|:)\d{2}(?:\.\d+)?Z$/i;

export type CacheVersion = string | number | Date | null | undefined;

function normalizeCacheVersion(version: CacheVersion): string | null {
  if (version == null || version === "") return null;
  if (version instanceof Date) return String(version.getTime());
  const raw = String(version).trim();
  if (!raw) return null;
  // ISO-8601 → epoch ms so ?v= never contains colons (some proxies corrupt them into the path).
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const ms = Date.parse(raw);
    if (!Number.isNaN(ms)) {
      logCmsImage("[cmsImageSrc] normalized ISO cacheVersion to epoch ms", {
        raw,
        ms,
      });
      return String(ms);
    }
  }
  return raw;
}

/** Strip corrupted cache-bust suffixes and existing `?v=` before re-appending. */
export function sanitizeCmsImagePath(src: string): string {
  const qIndex = src.indexOf("?");
  let pathname = qIndex >= 0 ? src.slice(0, qIndex) : src;

  if (CORRUPTED_PATH_TS_RE.test(pathname)) {
    const cleaned = pathname.replace(CORRUPTED_PATH_TS_RE, "");
    logCmsImage("[cmsImageSrc] stripped corrupted path suffix", {
      before: pathname,
      after: cleaned,
    });
    pathname = cleaned;
  }

  return pathname;
}

function splitPathAndQuery(src: string): { pathname: string; params: URLSearchParams } {
  const qIndex = src.indexOf("?");
  const pathname = qIndex >= 0 ? src.slice(0, qIndex) : src;
  const params = new URLSearchParams(qIndex >= 0 ? src.slice(qIndex + 1) : "");
  return { pathname, params };
}

/**
 * Append `?v=` for CMS-managed local images so browsers/CDNs re-fetch after admin saves.
 * Upload paths already include a millisecond timestamp in the filename; static paths
 * (e.g. `/logo.png`) rely on the DB `updatedAt` passed as `cacheVersion`.
 * Cache bust is ALWAYS a query param — never merged into the path.
 */
export function cmsImageSrc(src: string, cacheVersion?: CacheVersion): string {
  if (!src || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  const pathname = sanitizeCmsImagePath(src);
  const { params } = splitPathAndQuery(src);

  if (params.has("v")) {
    const existing = params.get("v") ?? "";
    const normalized = normalizeCacheVersion(existing) ?? existing;
    if (normalized !== existing) {
      params.set("v", normalized);
    }
    const query = params.toString();
    logCmsImage("[cmsImageSrc] existing v= param", { pathname, query });
    return query ? `${pathname}?${query}` : pathname;
  }

  const filenameTs = UPLOAD_FILENAME_TS_RE.exec(pathname)?.[1] ?? null;
  const version =
    filenameTs ??
    normalizeCacheVersion(cacheVersion) ??
    null;

  if (!version) {
    logCmsImage("[cmsImageSrc] no cache version", { pathname });
    return pathname;
  }

  params.set("v", version);
  const out = `${pathname}?${params.toString()}`;
  logCmsImage("[cmsImageSrc] appended v=", { pathname, version, out });
  return out;
}

export function imageOptsForSrc(src: string): { unoptimized?: boolean } {
  return isUploadedAsset(sanitizeCmsImagePath(src)) ? { unoptimized: true } : {};
}

export function resolveCmsImage(
  src: string,
  cacheVersion?: CacheVersion,
): { src: string; unoptimized?: boolean } {
  const pathname = sanitizeCmsImagePath(src);
  return {
    src: cmsImageSrc(pathname, cacheVersion),
    ...imageOptsForSrc(pathname),
  };
}

/**
 * Admin preview URLs read from the same persistent storage as POST /api/admin/upload,
 * so thumbnails work even when public/uploads is not symlinked on the server.
 */
export function adminCmsImageSrc(
  src: string,
  cacheVersion?: CacheVersion,
): string {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const pathname = sanitizeCmsImagePath(normalized);

  if (!isUploadedAsset(pathname)) {
    return cmsImageSrc(pathname, cacheVersion);
  }

  const cached = cmsImageSrc(pathname, cacheVersion);
  const qIndex = cached.indexOf("?");
  const pathOnly = qIndex >= 0 ? cached.slice(0, qIndex) : cached;
  const params = new URLSearchParams({ path: pathOnly });

  if (qIndex >= 0) {
    const existing = new URLSearchParams(cached.slice(qIndex + 1));
    existing.forEach((value, key) => params.set(key, value));
  }

  const out = `/api/admin/cms-asset?${params.toString()}`;
  console.log("[adminCmsImageSrc] mapped upload to admin asset API", {
    src: trimmed,
    out,
  });
  return out;
}
