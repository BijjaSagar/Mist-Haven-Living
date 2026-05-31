import type { ProductCategory } from "@prisma/client";
import { prisma, isDbConfigured } from "@/lib/db";
import {
  productCategories as staticCategories,
  getCategoryBySlug as staticGetBySlug,
  getAllCategorySlugs as staticGetAllSlugs,
} from "@/data/products";
import type { ProductCategoryData } from "@/lib/types/cms";

function mapProduct(row: ProductCategory): ProductCategoryData {
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    eyebrow: row.eyebrow,
    heroImage: row.heroImage,
    cardImage: row.cardImage,
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
    return staticCategories;
  }
  try {
    const rows = await prisma.productCategory.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCategories;
    return rows.map(mapProduct);
  } catch {
    return staticCategories;
  }
}

export async function getAllProductCategoriesAdmin(): Promise<
  ProductCategoryData[]
> {
  if (!isDbConfigured()) return staticCategories;
  try {
    const rows = await prisma.productCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticCategories;
    return rows.map(mapProduct);
  } catch {
    return staticCategories;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<ProductCategoryData | undefined> {
  if (!isDbConfigured()) {
    return staticGetBySlug(slug);
  }
  try {
    const row = await prisma.productCategory.findUnique({ where: { slug } });
    if (!row || !row.visible) return staticGetBySlug(slug);
    return mapProduct(row);
  } catch {
    return staticGetBySlug(slug);
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
