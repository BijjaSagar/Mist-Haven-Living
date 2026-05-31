import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import type { audienceSegments } from "@/data/products";

type Segment = (typeof audienceSegments)[number];

type SolutionsSectionProps = {
  segments: Segment[];
};

export function SolutionsSection({ segments }: SolutionsSectionProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-[22px] lg:grid-cols-4">
      {segments.map((segment, index) => (
        <FadeUp key={segment.title} delay={index * 0.05}>
          <Link
            href={segment.href}
            className="group relative flex h-full flex-col overflow-hidden border border-hairline bg-pearl p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_26px_48px_-34px_rgba(74,67,57,0.5)] motion-reduce:hover:translate-y-0 md:p-9"
          >
            <span
              className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-sage transition-transform duration-400 group-hover:scale-x-100 motion-reduce:transition-none"
              aria-hidden="true"
            />
            <h3 className="font-display text-2xl text-taupe md:text-[25px]">
              {segment.title}
            </h3>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-muted">
              {segment.description}
            </p>
          </Link>
        </FadeUp>
      ))}
    </div>
  );
}
