import type { ProductCategory } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma, isDbConfigured } from "@/lib/db";
import {
  productCategories as staticCategories,
  getCategoryBySlug as staticGetBySlug,
  getAllCategorySlugs as staticGetAllSlugs,
} from "@/data/products";
import {
  resolveProductCardImage,
  staleCardImageUpgrade,
} from "@/lib/image-props";
import type { ProductCategoryData } from "@/lib/types/cms";

function normalizeGalleryImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  }
  if (typeof value === "string") {
    try {
      return normalizeGalleryImages(JSON.parse(value));
    } catch {
      return [];
    }
  }
  return [];
}

function withSeoFields(
  category: Omit<ProductCategoryData, "metaTitle" | "metaDescription" | "galleryImages"> & {
    galleryImages?: string[];
  },
): ProductCategoryData {
  const galleryImages = normalizeGalleryImages(category.galleryImages);
  const cardImage = resolveProductCardImage({
    cardImage: category.cardImage,
    heroImage: category.heroImage,
    galleryImages,
  });

  console.log("[withSeoFields] resolved static category images", {
    slug: category.slug,
    cardImage,
  });

  return {
    ...category,
    metaTitle: null,
    metaDescription: null,
    galleryImages,
    cardImage,
  };
}

/** Persist gallery→card backfill once when DB still has picsum cardImage. */
async function upgradeStaleCardImageRow(
  row: ProductCategory,
): Promise<ProductCategory> {
  const galleryImages = normalizeGalleryImages(row.galleryImages);
  const upgraded = staleCardImageUpgrade({
    cardImage: row.cardImage,
    heroImage: row.heroImage,
    galleryImages,
  });

  if (!upgraded) {
    return row;
  }

  console.log("[upgradeStaleCardImageRow] persisting cardImage backfill", {
    slug: row.slug,
    from: row.cardImage,
    to: upgraded,
  });

  try {
    return await prisma.productCategory.update({
      where: { slug: row.slug },
      data: { cardImage: upgraded },
    });
  } catch (error) {
    console.error(
      "[upgradeStaleCardImageRow] persist failed — runtime resolve only",
      { slug: row.slug, error },
    );
    return { ...row, cardImage: upgraded };
  }
}

function mapProduct(row: ProductCategory): ProductCategoryData {
  const galleryImages = normalizeGalleryImages(row.galleryImages);
  const cardImage = resolveProductCardImage({
    cardImage: row.cardImage,
    heroImage: row.heroImage,
    galleryImages,
  });

  console.log("[mapProduct] resolved images", {
    slug: row.slug,
    dbCardImage: row.cardImage,
    resolvedCardImage: cardImage,
    updatedAt: row.updatedAt.toISOString(),
  });

  return {
    slug: row.slug,
    name: row.name,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    shortDescription: row.shortDescription,
    description: row.description,
    eyebrow: row.eyebrow,
    heroImage: row.heroImage,
    cardImage,
    galleryImages,
    features: row.features as string[],
    materials: row.materials as string[],
    sizes: row.sizes as ProductCategoryData["sizes"],
    gsmRange: row.gsmRange,
    customization: row.customization as string[],
    packaging: row.packaging as string[],
    idealFor: row.idealFor as string[],
    leadTime: row.leadTime,
    moq: row.moq,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getProductCategories(): Promise<ProductCategoryData[]> {
  // Never bake static picsum placeholders at CI build time — fetch from DB at runtime.
  noStore();
  console.log("[getProductCategories] noStore — runtime DB fetch (skip CI static bake-in)");

  if (!isDbConfigured()) {
    console.log("[getProductCategories] DATABASE_URL unset — static fallback");
    return staticCategories.map(withSeoFields);
  }
  try {
    const rows = await prisma.productCategory.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    console.log("[getProductCategories] fetched rows", { count: rows.length });
    if (rows.length === 0) {
      console.log("[getProductCategories] empty DB — static fallback");
      return staticCategories.map(withSeoFields);
    }
    const upgraded = await Promise.all(rows.map(upgradeStaleCardImageRow));
    return upgraded.map(mapProduct);
  } catch (error) {
    console.error("[getProductCategories] query failed — static fallback", error);
    return staticCategories.map(withSeoFields);
  }
}

export async function getAllProductCategoriesAdmin(): Promise<
  ProductCategoryData[]
> {
  if (!isDbConfigured()) return staticCategories.map(withSeoFields);
  try {
    const rows = await prisma.productCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCategories.map(withSeoFields);
    return rows.map(mapProduct);
  } catch {
    return staticCategories.map(withSeoFields);
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ProductCategoryData | undefined> {
  noStore();

  if (!isDbConfigured()) {
    const category = staticGetBySlug(slug);
    return category ? withSeoFields(category) : undefined;
  }
  try {
    const row = await prisma.productCategory.findUnique({ where: { slug } });
    if (!row || !row.visible) {
      const category = staticGetBySlug(slug);
      return category ? withSeoFields(category) : undefined;
    }
    return mapProduct(await upgradeStaleCardImageRow(row));
  } catch {
    const category = staticGetBySlug(slug);
    return category ? withSeoFields(category) : undefined;
  }
}

/** Admin editor: includes hidden products. */
export async function getCategoryBySlugAdmin(
  slug: string,
): Promise<ProductCategoryData | undefined> {
  if (!isDbConfigured()) {
    const category = staticGetBySlug(slug);
    return category ? withSeoFields(category) : undefined;
  }
  try {
    const row = await prisma.productCategory.findUnique({ where: { slug } });
    if (!row) {
      const category = staticGetBySlug(slug);
      return category ? withSeoFields(category) : undefined;
    }
    return mapProduct(await upgradeStaleCardImageRow(row));
  } catch {
    const category = staticGetBySlug(slug);
    return category ? withSeoFields(category) : undefined;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  noStore();

  if (!isDbConfigured()) return staticGetAllSlugs();
  try {
    const rows = await prisma.productCategory.findMany({
      where: { visible: true },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticGetAllSlugs();
    return rows.map((r) => r.slug);
  } catch {
    return staticGetAllSlugs();
  }
}

export async function getProductInterestOptions(): Promise<
  { value: string; label: string }[]
> {
  const categories = await getProductCategories();
  return categories.map((c) => ({ value: c.slug, label: c.name }));
}

export { mapProduct };
