import Link from "next/link";
import { HoverScaleImage } from "@/components/motion/HoverScaleImage";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ProductCategory } from "@/data/products";

type ProductCardProps = {
  category: ProductCategory;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ category, className, priority }: ProductCardProps) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden border border-hairline bg-white transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgba(30,27,22,0.15)]",
        className,
      )}
    >
      <HoverScaleImage
        src={category.cardImage}
        alt={category.name}
        fill
        containerClassName="aspect-[4/3] bg-oat"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="mb-2 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
          {category.eyebrow}
        </p>
        <h3 className="font-display text-xl text-taupe md:text-2xl">{category.name}</h3>
        <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-muted">
          {category.shortDescription}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-body text-sm font-medium text-sage-deep">
          View specifications
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
