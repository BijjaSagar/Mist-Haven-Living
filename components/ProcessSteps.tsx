import { FadeUp } from "@/components/motion/FadeUp";

type Step = {
  step: string;
  title: string;
  description: string;
};

type ProcessStepsProps = {
  steps: Step[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((item, index) => (
        <FadeUp key={item.step} delay={index * 0.05}>
          <div className="relative border border-hairline bg-white p-8">
            <span className="font-display text-4xl text-sage-deep/30">{item.step}</span>
            <h3 className="mt-4 font-display text-xl text-taupe">{item.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
