import { FadeUp } from "@/components/motion/FadeUp";

type Step = {
  step: string;
  title: string;
  description: string;
};

type HowWeWorkProcessProps = {
  steps: Step[];
};

export function HowWeWorkProcess({ steps }: HowWeWorkProcessProps) {
  return (
    <div className="relative">
      <div
        className="absolute left-4 top-0 hidden h-full w-px bg-sage/50 md:left-1/2 md:block md:-translate-x-px"
        aria-hidden="true"
      />
      <div className="space-y-8">
        {steps.map((item, index) => (
          <FadeUp key={item.step} delay={index * 0.04}>
            <div
              className={`relative flex flex-col gap-4 md:flex-row md:items-start ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="hidden md:block md:w-1/2" />
              <div
                className={`md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="border border-hairline bg-white p-6">
                  <span className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-taupe">{item.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
              <div
                className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-sage bg-pearl md:left-1/2 md:block"
                aria-hidden="true"
              />
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
