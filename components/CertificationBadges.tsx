import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { Award, Download } from "lucide-react";
import type { Certification } from "@/data/products";

type CertificationBadgesProps = {
  badges: Certification[];
};

export function CertificationBadges({ badges }: CertificationBadgesProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge, index) => (
        <FadeUp key={badge.name} delay={index * 0.04}>
          <div className="flex h-full flex-col gap-4 border border-hairline bg-white p-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-oat">
                <Award className="h-5 w-5 text-sage-deep" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-taupe">{badge.name}</h3>
                {badge.certificateNumber && (
                  <p className="mt-1 font-body text-xs text-sage-deep">
                    Ref: {badge.certificateNumber}
                  </p>
                )}
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed text-muted">
              {badge.description}
            </p>
            {badge.pdfUrl && (
              <Link
                href={badge.pdfUrl}
                className="mt-auto inline-flex items-center gap-2 font-body text-sm font-medium text-sage-deep hover:text-taupe"
                download
              >
                <Download className="h-4 w-4" />
                Download certificate
              </Link>
            )}
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
