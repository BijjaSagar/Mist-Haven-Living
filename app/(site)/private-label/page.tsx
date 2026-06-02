import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { createMetadata, serviceJsonLd } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/button";
import { imageOptsForSrc } from "@/lib/image-props";
import { getCategoryBySlug } from "@/lib/data/products";
import { getPageContent } from "@/lib/data/pages";

export async function generateMetadata() {
  const page = await getPageContent("private-label");
  return createMetadata({
    title: page?.metaTitle ?? "Private Label",
    description:
      page?.metaDescription ??
      "Launch or scale your towel and linen brand with full private label manufacturing—from product development to retail-ready packaging. Export to USA and Canada.",
    path: "/private-label",
  });
}

export const revalidate = 86400;

const privateLabelFeatures = [
  {
    title: "Product Development",
    description:
      "Dedicated R&D team works from your brief to develop custom GSM, weave, size, and colour specifications.",
  },
  {
    title: "Rapid Sampling",
    description:
      "Physical samples within 2–3 weeks. Revisions included until your team approves production specs.",
  },
  {
    title: "Brand Implementation",
    description:
      "Logo weaving, embroidery, woven labels, hang tags, and packaging designed to your brand guidelines.",
  },
  {
    title: "Flexible MOQs",
    description:
      "Start from 500 units per SKU—designed for emerging brands scaling into North American retail.",
  },
  {
    title: "Retail-Ready Packaging",
    description:
      "Polybags, belly bands, gift boxes, and e-commerce friendly formats with your branding.",
  },
  {
    title: "Export Logistics",
    description:
      "FOB/CIF to USA and Canada ports with complete documentation and dedicated account management.",
  },
  {
    title: "Quality Assurance",
    description:
      "Same ISO-certified production and lab testing as our hospitality programs—consistent every batch.",
  },
  {
    title: "Exclusive Programs",
    description:
      "Territory exclusivity and custom colour development available for qualifying brand partners.",
  },
];

const privateLabelSteps = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "Share your brand vision, target market, price point, and timeline. We recommend product categories and specifications.",
  },
  {
    step: "02",
    title: "Development & Sampling",
    description:
      "Our team creates lab dips, weave samples, and physical prototypes for your approval.",
  },
  {
    step: "03",
    title: "Production & Branding",
    description:
      "Approved specs move to production with your logos, labels, and packaging integrated.",
  },
  {
    step: "04",
    title: "Export & Launch Support",
    description:
      "FOB/CIF shipment with full documentation. Ongoing replenishment and seasonal program support.",
  },
];

type PrivateLabelSpecs = {
  title?: string;
  description?: string;
  pdfUrl?: string;
  pdfLabel?: string;
};

export default async function PrivateLabelPage() {
  const page = await getPageContent("private-label");
  const hero = (page?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  const packaging = (page?.sections.packaging ?? {}) as {
    imageUrl?: string;
  };
  const specs = (page?.sections?.specs ?? {}) as PrivateLabelSpecs;
  const category = await getCategoryBySlug("private-labeling");

  const jsonLd = serviceJsonLd(
    "Private Label Textile Manufacturing",
    "Full private label programs for towel and linen brands exporting to USA and Canada.",
    "/private-label",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className={
          hero.imageUrl
            ? "relative min-h-[70vh] overflow-hidden pt-28"
            : "pt-32 pb-section-mobile md:pb-section-desktop"
        }
      >
        {hero.imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={hero.imageUrl}
              alt="Private label textile manufacturing"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              {...imageOptsForSrc(hero.imageUrl)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pearl/95 via-pearl/85 to-pearl/50" />
          </div>
        ) : null}
        <div
          className={
            hero.imageUrl
              ? "relative mx-auto max-w-container px-6 py-section-mobile md:px-8 md:py-section-desktop"
              : "mx-auto max-w-container px-6 md:px-8"
          }
        >
          <FadeUp className="max-w-2xl">
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              {hero.eyebrow ?? "Private Label · High Priority"}
            </p>
            <h1 className="font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
              {hero.title ?? "Your brand. Our manufacturing excellence."}
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-muted">
              {hero.description ??
                "Partner with Mist & Haven Living to launch, scale, or refresh your towel and linen brand. End-to-end private label—from first sample to retail-ready cartons shipped to USA and Canada."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/contact#inquiry">Start Your Brand Program</Link>
              </Button>
              {category && (
                <Button asChild variant="outline" size="lg">
                  <Link href={`/products/${category.slug}`}>
                    View Specifications
                  </Link>
                </Button>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Capabilities"
              title="Everything you need to launch in North America"
              description="We handle manufacturing complexity so you can focus on brand, marketing, and sales."
              className="mb-12"
            />
          </FadeUp>
          <FeatureGrid features={privateLabelFeatures} columns={4} />
        </div>
      </section>

      <section className="border-y border-hairline bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="How It Works"
              title="Four steps from concept to carton"
              className="mb-12"
            />
          </FadeUp>
          <ProcessSteps steps={privateLabelSteps} />
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeUp>
              <div className="relative aspect-square overflow-hidden bg-oat">
                {packaging.imageUrl ? (
                  <Image
                    src={packaging.imageUrl}
                    alt="Private label packaging"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    {...imageOptsForSrc(packaging.imageUrl)}
                  />
                ) : null}
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <SectionHeading
                eyebrow="Ideal Partners"
                title="Built for brands at every stage"
                description="Whether you are launching on Amazon, supplying boutique retailers, or building a hospitality amenity line—we scale with you."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Emerging DTC and e-commerce brands",
                  "Regional retail chains and department stores",
                  "Spa and wellness lifestyle brands",
                  "Corporate gifting and promotional agencies",
                  "Hospitality groups developing proprietary lines",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-body text-sm text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-deep" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {(specs.title || specs.description || specs.pdfUrl) && (
        <section className="border-t border-hairline bg-white py-section-mobile md:py-section-desktop">
          <div className="mx-auto max-w-container px-6 md:px-8">
            <FadeUp>
              <div className="mx-auto max-w-2xl text-center">
                <SectionHeading
                  eyebrow="Specifications"
                  title={specs.title ?? "Private label specifications"}
                  description={
                    specs.description ??
                    "Capability sheet with GSM ranges, customization, MOQs, and lead times."
                  }
                  className="mb-8"
                />
                {specs.pdfUrl ? (
                  <Button asChild size="lg">
                    <a href={specs.pdfUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      {specs.pdfLabel ?? "Download specification sheet (PDF)"}
                    </a>
                  </Button>
                ) : (
                  <p className="font-body text-sm text-muted">
                    Specification PDF coming soon.{" "}
                    <Link href="/contact#inquiry" className="text-sage-deep hover:underline">
                      Contact us
                    </Link>{" "}
                    for a copy.
                  </p>
                )}
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      <CTABand prefilledProduct="private-labeling" />
    </>
  );
}
