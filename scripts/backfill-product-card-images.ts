/**
 * One-shot: upgrade product cardImage from gallery/hero when still picsum seeds.
 * Run on server after deploy: npx tsx scripts/backfill-product-card-images.ts
 */
import { prisma } from "@/lib/db";
import { staleCardImageUpgrade } from "@/lib/image-props";

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

async function main() {
  console.log("[backfill-product-card-images] starting");

  const rows = await prisma.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });

  let upgraded = 0;
  for (const row of rows) {
    const galleryImages = normalizeGalleryImages(row.galleryImages);
    const nextCard = staleCardImageUpgrade({
      cardImage: row.cardImage,
      heroImage: row.heroImage,
      galleryImages,
    });

    if (!nextCard) {
      console.log("[backfill-product-card-images] skip", {
        slug: row.slug,
        cardImage: row.cardImage,
      });
      continue;
    }

    await prisma.productCategory.update({
      where: { slug: row.slug },
      data: { cardImage: nextCard },
    });
    upgraded += 1;
    console.log("[backfill-product-card-images] upgraded", {
      slug: row.slug,
      from: row.cardImage,
      to: nextCard,
    });
  }

  console.log("[backfill-product-card-images] done", {
    total: rows.length,
    upgraded,
  });
}

main()
  .catch((error) => {
    console.error("[backfill-product-card-images] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
