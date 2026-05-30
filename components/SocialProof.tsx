import { FadeUp } from "@/components/motion/FadeUp";

type SocialProofProps = {
  tradeShows: string[];
  caseStudy: {
    title: string;
    summary: string;
  };
};

export function SocialProof({ tradeShows, caseStudy }: SocialProofProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <FadeUp>
        <div className="border border-hairline bg-white p-8">
          <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
            Trade Shows
          </p>
          <ul className="mt-4 space-y-3">
            {tradeShows.map((show) => (
              <li key={show} className="font-display text-lg text-taupe">
                {show}
              </li>
            ))}
          </ul>
        </div>
      </FadeUp>
      <FadeUp delay={0.08}>
        <div className="border border-hairline bg-oat p-8">
          <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
            Case Study
          </p>
          <h3 className="mt-4 font-display text-xl text-taupe">{caseStudy.title}</h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted">
            {caseStudy.summary}
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
