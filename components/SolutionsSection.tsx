import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowUpRight } from "lucide-react";
import type { audienceSegments } from "@/data/products";

type Segment = (typeof audienceSegments)[number];

type SolutionsSectionProps = {
  segments: Segment[];
};

export function SolutionsSection({ segments }: SolutionsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {segments.map((segment, index) => (
        <FadeUp key={segment.title} delay={index * 0.05}>
          <Link
            href={segment.href}
            className="group flex h-full flex-col border border-hairline bg-white p-6 transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(94,85,71,0.15)]"
          >
            <h3 className="font-display text-xl text-taupe">{segment.title}</h3>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-muted">
              {segment.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 font-body text-sm font-medium text-sage-deep group-hover:text-taupe">
              Learn more
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </FadeUp>
      ))}
    </div>
  );
}
