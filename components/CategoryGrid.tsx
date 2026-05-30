import { ProductCard } from "@/components/ProductCard";
import { FadeUp } from "@/components/motion/FadeUp";
import type { ProductCategory } from "@/data/products";

type CategoryGridProps = {
  categories: ProductCategory[];
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
    <div className={`grid gap-6 ${gridClass}`}>
      {categories.map((category, index) => (
        <FadeUp key={category.slug} delay={index * 0.05}>
          <ProductCard category={category} priority={index < 3} />
        </FadeUp>
      ))}
    </div>
  );
}
