import { ProductCard } from "@/components/ProductCard";
import { StaggerChildren } from "@/components/motion/StaggerChildren";
import type { ProductCategoryData } from "@/lib/types/cms";

type CategoryGridProps = {
  categories: ProductCategoryData[];
  columns?: 2 | 3 | 4;
};

export function CategoryGrid({ categories, columns = 3 }: CategoryGridProps) {
  const gridClass =
    columns === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <StaggerChildren className={`grid gap-6 ${gridClass}`}>
      {categories.map((category, index) => (
        <ProductCard
          key={category.slug}
          category={category}
          priority={index < 3}
        />
      ))}
    </StaggerChildren>
  );
}
