import type { ProductCategoryData } from "@/lib/types/cms";

type ProductMarqueeProps = {
  categories: ProductCategoryData[];
  className?: string;
};

export function ProductMarquee({ categories, className }: ProductMarqueeProps) {
  const names = categories.map((c) => c.name);
  const track = [...names, ...names];

  return (
    <div
      className={`marquee-wrap relative mb-10 overflow-hidden border-y border-hairline py-4 md:mb-14 ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {track.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="font-body text-[11px] uppercase tracking-[0.28em] text-muted"
          >
            {name}
            <span className="mx-10 text-sage">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
