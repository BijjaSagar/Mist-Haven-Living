import { FadeUp } from "@/components/motion/FadeUp";
import { ShieldCheck } from "lucide-react";

type SocialComplianceSectionProps = {
  points: string[];
};

export function SocialComplianceSection({ points }: SocialComplianceSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {points.map((point, index) => (
        <FadeUp key={point} delay={index * 0.04}>
          <div className="flex gap-4 border border-hairline bg-white p-5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-sage-deep" />
            <p className="font-body text-sm leading-relaxed text-muted">{point}</p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
