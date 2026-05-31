import Link from "next/link";
import { HoverScaleImage } from "@/components/motion/HoverScaleImage";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProductCategoryData } from "@/lib/types/cms";

type ProductCardProps = {
  category: ProductCategoryData;
  className?: string;
  priority?: boolean;
  variant?: "default" | "compact";
};

export function ProductCard({
  category,
  className,
  priority,
  variant = "default",
}: ProductCardProps) {
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/products/${category.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden border border-hairline bg-pearl transition-all duration-400",
        isCompact
          ? "hover:-translate-y-1 hover:shadow-[0_28px_50px_-34px_rgba(74,67,57,0.55)] motion-reduce:hover:translate-y-0"
          : "hover:shadow-[0_20px_60px_-20px_rgba(30,27,22,0.15)]",
        className,
      )}
    >
      <HoverScaleImage
        src={category.cardImage}
        alt={category.name}
        fill
        containerClassName={cn(
          "relative bg-oat",
          isCompact ? "aspect-square" : "aspect-[4/3]",
        )}
        sizes={
          isCompact
            ? "(max-width: 768px) 50vw, 25vw"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        priority={priority}
      />
      {isCompact ? (
        <div className="flex items-center justify-between px-4 py-4 md:px-[18px] md:py-[17px]">
          <h3 className="font-display text-lg text-taupe md:text-[19px]">
            {category.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-sage-deep transition-transform duration-350 group-hover:translate-x-1 motion-reduce:transition-none" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
            {category.eyebrow}
          </p>
          <h3 className="font-display text-xl text-taupe md:text-2xl">
            {category.name}
          </h3>
          <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-muted">
            {category.shortDescription}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 font-body text-sm font-medium text-sage-deep">
            View specifications
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      )}
    </Link>
  );
}
