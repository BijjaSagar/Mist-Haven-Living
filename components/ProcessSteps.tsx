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
    <div className="grid gap-5 md:grid-cols-2 md:gap-[22px] lg:grid-cols-3">
      {steps.map((item, index) => (
        <FadeUp key={item.step} delay={index * 0.05}>
          <div className="relative border border-hairline bg-pearl p-8 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_26px_48px_-34px_rgba(74,67,57,0.5)] motion-reduce:hover:translate-y-0">
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
