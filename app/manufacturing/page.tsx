import Image from "next/image";
import { createMetadata, serviceJsonLd } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { StatStrip } from "@/components/StatStrip";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { manufacturingSteps, companyStats } from "@/data/products";

export const metadata = createMetadata({
  title: "Manufacturing",
  description:
    "Vertical textile manufacturing from yarn selection to export packaging. ISO-certified facility in Solapur, India serving USA and Canada buyers.",
  path: "/manufacturing",
});

export const revalidate = 86400;

export default function ManufacturingPage() {
  const jsonLd = serviceJsonLd(
    "Textile Manufacturing",
    "End-to-end terry towel and linen manufacturing for B2B export.",
    "/manufacturing",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-32 pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              Our Facility
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
              From yarn to export-ready carton
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
              120,000 sq ft of vertically integrated manufacturing in Solapur—with
              in-house weaving, dyeing, finishing, and quality laboratories.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="relative aspect-[21/9] overflow-hidden bg-oat">
            <Image
              src="https://picsum.photos/seed/manufacturing-wide/1400/600"
              alt="Manufacturing floor"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-hairline bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Process"
              title="Six stages of precision production"
              className="mb-12"
            />
          </FadeUp>
          <ProcessSteps steps={manufacturingSteps} />
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeUp>
              <SectionHeading
                eyebrow="Quality Lab"
                title="Tested before every shipment"
                description="Every production batch undergoes random sampling for GSM weight, absorbency rate, dimensional shrinkage after washing, colour-fastness, and tensile strength. Results are documented and available upon request."
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "GSM verification",
                  "Absorbency testing",
                  "Shrinkage analysis",
                  "Colour-fastness",
                  "Tensile strength",
                  "Visual inspection (100%)",
                ].map((test) => (
                  <div
                    key={test}
                    className="border border-hairline bg-white p-4 font-body text-sm text-taupe"
                  >
                    {test}
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-taupe py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StatStrip stats={companyStats} dark />
        </div>
      </section>

      <CTABand />
    </>
  );
}
