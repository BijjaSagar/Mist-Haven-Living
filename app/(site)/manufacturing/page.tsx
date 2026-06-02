import Image from "next/image";
import { createMetadata, serviceJsonLd } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { StatStrip } from "@/components/StatStrip";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { imageOptsForSrc } from "@/lib/image-props";
import { manufacturingSteps } from "@/data/products";
import { getPageContent } from "@/lib/data/pages";
import { getStats } from "@/lib/data/stats";

export async function generateMetadata() {
  const page = await getPageContent("manufacturing");
  return createMetadata({
    title: page?.metaTitle ?? "Manufacturing",
    description:
      page?.metaDescription ??
      "Vertical textile manufacturing from yarn selection to export packaging. ISO-certified facility in Solapur, India serving USA and Canada buyers.",
    path: "/manufacturing",
  });
}

export const revalidate = 86400;

export default async function ManufacturingPage() {
  const [companyStats, page] = await Promise.all([
    getStats(),
    getPageContent("manufacturing"),
  ]);

  const hero = (page?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  const facility = (page?.sections.facility ?? {}) as {
    imageUrl?: string;
  };

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

      {hero.imageUrl ? (
        <section className="relative min-h-[50vh] overflow-hidden pt-28">
          <div className="absolute inset-0">
            <Image
              src={hero.imageUrl}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              {...imageOptsForSrc(hero.imageUrl)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pearl/90 via-pearl/75 to-pearl" />
          </div>
          <div className="relative mx-auto max-w-container px-6 pb-section-mobile md:px-8 md:pb-section-desktop">
            <FadeUp>
              <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                {hero.eyebrow ?? "Our Facility"}
              </p>
              <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
                {hero.title ?? "From yarn to export-ready carton"}
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
                {hero.description ??
                  "120,000 sq ft of vertically integrated manufacturing in Solapur—with in-house weaving, dyeing, finishing, and quality laboratories."}
              </p>
            </FadeUp>
          </div>
        </section>
      ) : (
        <section className="pt-32 pb-section-mobile md:pb-section-desktop">
          <div className="mx-auto max-w-container px-6 md:px-8">
            <FadeUp>
              <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                {hero.eyebrow ?? "Our Facility"}
              </p>
              <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
                {hero.title ?? "From yarn to export-ready carton"}
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
                {hero.description ??
                  "120,000 sq ft of vertically integrated manufacturing in Solapur—with in-house weaving, dyeing, finishing, and quality laboratories."}
              </p>
            </FadeUp>
          </div>
        </section>
      )}

      {facility.imageUrl ? (
        <section className="pb-section-mobile md:pb-section-desktop">
          <div className="mx-auto max-w-container px-6 md:px-8">
            <div className="relative aspect-[21/9] overflow-hidden bg-oat">
              <Image
                src={facility.imageUrl}
                alt="Manufacturing floor"
                fill
                className="object-cover"
                sizes="100vw"
                {...imageOptsForSrc(facility.imageUrl)}
              />
            </div>
          </div>
        </section>
      ) : null}

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
