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
  return (
    <div
      className={`grid gap-8 ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"}`}
    >
      {features.map((feature, index) => (
        <FadeUp key={feature.title} delay={index * 0.04}>
          <div className="border-t border-hairline pt-6">
            <h3 className="font-display text-lg text-taupe">{feature.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
