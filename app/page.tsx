import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { CertificationBadges } from "@/components/CertificationBadges";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProcessSteps } from "@/components/ProcessSteps";
import { StatStrip } from "@/components/StatStrip";
import { CTABand } from "@/components/CTABand";
import { WaveDivider } from "@/components/WaveDivider";
import { SolutionsSection } from "@/components/SolutionsSection";
import { HowWeWorkProcess } from "@/components/HowWeWorkProcess";
import { TradeTermsBlock } from "@/components/TradeTermsBlock";
import { FabricGallery } from "@/components/FabricGallery";
import { SocialProof } from "@/components/SocialProof";
import { SocialComplianceSection } from "@/components/SocialComplianceSection";
import { CatalogCTA } from "@/components/CatalogGateModal";
import { ScheduleDiscussion } from "@/components/ScheduleDiscussion";
import { FadeUp } from "@/components/motion/FadeUp";
import {
  productCategories,
  certifications,
  whyChooseUsFeatures,
  manufacturingSteps,
  companyStats,
  audienceSegments,
  howWeWorkSteps,
  tradeTerms,
  fabricTextures,
  tradeShows,
  caseStudySnippet,
  socialCompliancePoints,
} from "@/data/products";

export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden pt-28 md:pt-32">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/mist-hero/1920/1200"
            alt="Luxury textile manufacturing"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pearl/95 via-pearl/80 to-pearl/30" />
          <div
            className="pointer-events-none absolute inset-0 animate-hero-shimmer bg-gradient-to-br from-sage/10 via-transparent to-oat/20 motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto flex min-h-[calc(90vh-6rem)] max-w-container items-center px-6 md:px-8">
          <FadeUp className="max-w-2xl">
            <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.22em] text-sage-deep">
              Deepam Textiles · Solapur, India
            </p>
            <h1 className="font-display text-[2.75rem] italic leading-[1.1] tracking-tight text-taupe md:text-[4rem]">
              Luxury In Every Thread.
            </h1>
            <p className="mt-6 max-w-lg font-body text-[17px] leading-relaxed text-muted md:text-lg">
              Premium B2B textile manufacturing for hospitality, retail, and
              private label buyers across the USA and Canada.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/contact#inquiry">Request Export Quote</Link>
              </Button>
              <CatalogCTA />
              <Button asChild variant="outline" size="lg">
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      <WaveDivider variant="sage" />

      {/* Stat strip */}
      <section className="border-y border-hairline bg-oat py-12 md:py-16">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StatStrip stats={companyStats} />
        </div>
      </section>

      {/* About strip */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeUp>
              <SectionHeading
                eyebrow="Our Heritage"
                title="Crafted by Deepam Textiles, Solapur"
                description="For over four decades, Deepam Textiles has been at the heart of India's premier terry towel manufacturing region. Mist & Haven Living is our export-facing brand—bringing institutional-grade quality and boutique-level finishing to North American buyers."
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden bg-pearl">
                <Image
                  src="https://picsum.photos/seed/deepam-factory/900/675"
                  alt="Deepam Textiles manufacturing facility"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <WaveDivider variant="oat" flip />

      {/* Solutions for */}
      <section className="bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Solutions For"
              title="Tailored programs for every buyer type"
              description="Whether you procure for hotels, retail shelves, distribution networks, or direct import—we align specifications, MOQs, and documentation to your channel."
              className="mb-12"
            />
          </FadeUp>
          <SolutionsSection segments={audienceSegments} />
        </div>
      </section>

      {/* Fabric textures */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Material Close-Ups"
              title="Feel the weave before you order"
              description="Macro fabric photography from our production floor—terry loop, zero-twist plush, waffle, and velour finishes."
              className="mb-12"
            />
          </FadeUp>
          <FabricGallery textures={fabricTextures} />
        </div>
      </section>

      {/* Certifications */}
      <section className="border-y border-hairline bg-white py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Compliance"
              title="Certified for global export"
              description="Our manufacturing meets international quality, safety, and ethical standards required by North American hospitality and retail buyers."
              align="center"
              className="mx-auto mb-12"
            />
          </FadeUp>
          <CertificationBadges badges={certifications.slice(0, 3)} />
          <div className="mt-8 text-center">
            <Link
              href="/certifications"
              className="font-body text-sm font-medium text-sage-deep hover:underline"
            >
              View all certifications →
            </Link>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="How We Work"
              title="From inquiry to delivery"
              description="A transparent seven-step export process designed for professional procurement teams."
              className="mb-12"
            />
          </FadeUp>
          <HowWeWorkProcess steps={howWeWorkSteps} />
        </div>
      </section>

      <WaveDivider variant="sage" />

      {/* Trade terms */}
      <section className="bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Trade Terms"
              title="Clear terms for export buyers"
              className="mb-12"
            />
          </FadeUp>
          <TradeTermsBlock terms={tradeTerms} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Why Mist & Haven"
              title="Built for B2B buyers who demand consistency"
              description="From GSM tolerance to export documentation, every detail is engineered for professional procurement."
              className="mb-12"
            />
          </FadeUp>
          <FeatureGrid features={whyChooseUsFeatures} />
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Product Range"
              title="Twelve categories, one standard of excellence"
              description="From bath towels to private label programs—explore our full export catalogue."
              className="mb-12"
            />
          </FadeUp>
          <CategoryGrid categories={productCategories} />
        </div>
      </section>

      {/* Manufacturing Strength */}
      <section className="border-y border-hairline bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Manufacturing"
              title="Vertical integration from yarn to export"
              description="Six-stage production with in-house quality lab testing on every batch."
              className="mb-12"
            />
          </FadeUp>
          <ProcessSteps steps={manufacturingSteps.slice(0, 3)} />
          <div className="mt-8">
            <Link
              href="/manufacturing"
              className="font-body text-sm font-medium text-sage-deep hover:underline"
            >
              Full manufacturing process →
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Industry Presence"
              title="Trusted at leading trade shows"
              className="mb-12"
            />
          </FadeUp>
          <SocialProof tradeShows={tradeShows} caseStudy={caseStudySnippet} />
        </div>
      </section>

      {/* Social compliance */}
      <section className="border-t border-hairline bg-white py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Social Compliance"
              title="Ethical manufacturing you can stand behind"
              description="Our labour practices align with international standards expected by North American buyers."
              className="mb-12"
            />
          </FadeUp>
          <SocialComplianceSection points={socialCompliancePoints} />
        </div>
      </section>

      {/* Schedule discussion */}
      <section className="bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeUp>
              <SectionHeading
                eyebrow="Let's Talk"
                title="Schedule a discussion with our export team"
                description="Prefer a live conversation? Book a call to review specs, sampling, and trade terms."
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <ScheduleDiscussion />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABand />
    </>
  );
}
