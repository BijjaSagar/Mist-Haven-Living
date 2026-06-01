import { siteConfig } from "@/lib/utils";

export const LEGACY_BRAND_PATTERN = /deepam/i;

export function containsLegacyBrand(value: unknown): boolean {
  return typeof value === "string" && LEGACY_BRAND_PATTERN.test(value);
}

export function sanitizeLegacyBranding(value: string): string {
  if (!containsLegacyBrand(value)) return value;
  return value
    .replace(/Deepam Textiles/gi, siteConfig.name)
    .replace(/Deepam/gi, siteConfig.name);
}

export function sanitizeLegacyBrandingJson(value: unknown): unknown {
  if (typeof value === "string") return sanitizeLegacyBranding(value);
  if (Array.isArray(value)) return value.map(sanitizeLegacyBrandingJson);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        sanitizeLegacyBrandingJson(nested),
      ]),
    );
  }
  return value;
}

export function mergeStringField(fallback: unknown, db: unknown): unknown {
  if (containsLegacyBrand(db)) {
    return typeof fallback === "string"
      ? fallback
      : sanitizeLegacyBranding(String(db));
  }
  if (typeof db === "string" && db.trim() !== "") {
    return db;
  }
  if (db !== null && db !== undefined && db !== "") {
    return db;
  }
  return fallback;
}

export function deepMergeSections(
  fallback: Record<string, unknown> | undefined,
  db: unknown,
): Record<string, unknown> {
  const fallbackSections = fallback ?? {};
  const dbSections = (db ?? {}) as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  const allKeys = new Set([
    ...Object.keys(fallbackSections),
    ...Object.keys(dbSections),
  ]);

  for (const key of allKeys) {
    const fallbackValue = fallbackSections[key];
    const dbValue = dbSections[key];

    if (
      typeof fallbackValue === "object" &&
      fallbackValue !== null &&
      !Array.isArray(fallbackValue) &&
      typeof dbValue === "object" &&
      dbValue !== null &&
      !Array.isArray(dbValue)
    ) {
      const merged: Record<string, unknown> = {
        ...(fallbackValue as Record<string, unknown>),
      };
      for (const [field, dbFieldValue] of Object.entries(
        dbValue as Record<string, unknown>,
      )) {
        merged[field] = mergeStringField(
          (fallbackValue as Record<string, unknown>)[field],
          dbFieldValue,
        );
      }
      result[key] = merged;
    } else {
      result[key] = mergeStringField(fallbackValue, dbValue);
    }
  }

  return result;
}
