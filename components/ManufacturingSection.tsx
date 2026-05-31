import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

type Step = {
  step: string;
  title: string;
  description: string;
};

type ManufacturingSectionProps = {
  steps: Step[];
  imageUrl?: string;
};

export function ManufacturingSection({
  steps,
  imageUrl = "https://picsum.photos/seed/mist-factory/900/720",
}: ManufacturingSectionProps) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
      <FadeUp>
        <div className="relative aspect-[5/4] overflow-hidden border border-hairline bg-oat">
          <Image
            src={imageUrl}
            alt="Mist & Haven Living manufacturing facility in Solapur"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.1}>
        <SectionHeading
          eyebrow="Manufacturing Strength"
          title="From Solapur, to the world."
          showWave
        />
        <ol className="mt-8 list-none">
          {steps.map((item) => (
            <li
              key={item.step}
              className="flex gap-4 border-b border-hairline py-4 first:pt-0 md:gap-5 md:py-[18px]"
            >
              <span className="min-w-[26px] font-display text-[15px] text-sage-deep">
                {item.step}
              </span>
              <div>
                <p className="font-display text-[19px] font-medium text-taupe">
                  {item.title}
                </p>
                <p className="mt-0.5 font-body text-[13.5px] text-muted">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href="/manufacturing"
          className="mt-6 inline-flex items-center gap-2 border-b border-sage-deep pb-1 font-body text-[12.5px] uppercase tracking-[0.14em] text-taupe transition-colors hover:text-sage-deep"
        >
          Full manufacturing process
          <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeUp>
    </div>
  );
}
