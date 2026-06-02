import type { ProductCategory } from "@prisma/client";
import { prisma, isDbConfigured } from "@/lib/db";
import {
  productCategories as staticCategories,
  getCategoryBySlug as staticGetBySlug,
  getAllCategorySlugs as staticGetAllSlugs,
} from "@/data/products";
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
  return {
    ...category,
    metaTitle: null,
    metaDescription: null,
    galleryImages: normalizeGalleryImages(category.galleryImages),
  };
}

function mapProduct(row: ProductCategory): ProductCategoryData {
  return {
    slug: row.slug,
    name: row.name,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    shortDescription: row.shortDescription,
    description: row.description,
    eyebrow: row.eyebrow,
    heroImage: row.heroImage,
    cardImage: row.cardImage,
    galleryImages: normalizeGalleryImages(row.galleryImages),
    features: row.features as string[],
    materials: row.materials as string[],
    sizes: row.sizes as ProductCategoryData["sizes"],
    gsmRange: row.gsmRange,
    customization: row.customization as string[],
    packaging: row.packaging as string[],
    idealFor: row.idealFor as string[],
    leadTime: row.leadTime,
    moq: row.moq,
  };
}

export async function getProductCategories(): Promise<ProductCategoryData[]> {
  if (!isDbConfigured()) {
    return staticCategories.map(withSeoFields);
  }
  try {
    const rows = await prisma.productCategory.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCategories.map(withSeoFields);
    return rows.map(mapProduct);
  } catch {
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
    return mapProduct(row);
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
    return mapProduct(row);
  } catch {
    const category = staticGetBySlug(slug);
    return category ? withSeoFields(category) : undefined;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
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
