import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
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
  if (categories.length === 0) {
    return (
      <EmptyState
        title="Product catalogue coming soon"
        description="Our export categories are being updated. Contact us for current availability, specs, and MOQs."
        actionLabel="Request a quote"
        actionHref="/contact"
      />
    );
  }

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
