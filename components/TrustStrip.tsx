import type { CertificationDisplay } from "@/lib/data/certifications";

type TrustStripProps = {
  certifications: CertificationDisplay[];
};

export function TrustStrip({ certifications }: TrustStripProps) {
  const items = certifications.slice(0, 3);

  return (
    <div className="border-y border-hairline bg-pearl">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-4 gap-y-3 px-6 py-6 md:gap-x-6 md:px-8 md:py-7">
        <span className="font-body text-[11px] uppercase tracking-[0.24em] text-muted">
          Certified & Compliant
        </span>
        {items.map((cert) => (
          <span key={cert.name} className="flex items-center gap-4 md:gap-6">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-sage-deep"
              aria-hidden="true"
            />
            <span className="font-display text-base text-taupe md:text-[21px]">
              {cert.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
