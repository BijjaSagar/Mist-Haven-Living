import { ProductCard } from "@/components/ProductCard";
import { StaggerChildren } from "@/components/motion/StaggerChildren";
import type { ProductCategoryData } from "@/lib/types/cms";

type CategoryGridProps = {
  categories: ProductCategoryData[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "compact";
};

export function CategoryGrid({
  categories,
  columns = 4,
  variant = "compact",
}: CategoryGridProps) {
  const gridClass =
    columns === 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <StaggerChildren className={`grid gap-5 md:gap-[22px] ${gridClass}`}>
      {categories.map((category, index) => (
        <ProductCard
          key={category.slug}
          category={category}
          priority={index < 4}
          variant={variant}
        />
      ))}
    </StaggerChildren>
  );
}
