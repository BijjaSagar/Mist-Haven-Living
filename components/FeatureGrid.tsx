import { FadeUp } from "@/components/motion/FadeUp";

type Feature = {
  title: string;
  description: string;
};

type FeatureGridProps = {
  features: Feature[];
  columns?: 2 | 4;
};

export function FeatureGrid({ features, columns = 4 }: FeatureGridProps) {
  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <div
      className={`grid gap-px border border-hairline bg-hairline ${gridCols}`}
    >
      {features.map((feature, index) => (
        <FadeUp key={feature.title} delay={index * 0.04}>
          <div className="h-full bg-pearl p-7 transition-colors duration-300 hover:bg-oat md:p-8">
            <span className="font-display text-lg text-sage-deep">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3.5 font-display text-[1.4375rem] text-taupe">
              {feature.title}
            </h3>
            <p className="mt-2 font-body text-[13.5px] leading-relaxed text-muted">
              {feature.description}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
