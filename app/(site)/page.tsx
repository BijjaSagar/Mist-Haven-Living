import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductMarquee } from "@/components/ProductMarquee";
import { StatStrip } from "@/components/StatStrip";
import { CTABand } from "@/components/CTABand";
import { SolutionsSection } from "@/components/SolutionsSection";
import { ManufacturingSection } from "@/components/ManufacturingSection";
import { HomeInquirySection } from "@/components/HomeInquirySection";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowRight } from "lucide-react";
import {
  whyChooseUsFeatures,
  manufacturingHighlights,
  audienceSegments,
} from "@/data/products";
import { getProductCategories } from "@/lib/data/products";
import { getStats } from "@/lib/data/stats";
import { getCertifications } from "@/lib/data/certifications";
import { getPageContent } from "@/lib/data/pages";

export const revalidate = 86400;

export default async function HomePage() {
  const [productCategories, companyStats, certifications, homePage] =
    await Promise.all([
      getProductCategories(),
      getStats(),
      getCertifications(),
      getPageContent("home"),
    ]);

  const hero = (homePage?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    slides?: { imageUrl: string; caption: string }[];
  };
  const heritage = (homePage?.sections.heritage ?? {}) as {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  const manufacturingSection = (homePage?.sections.manufacturing ?? {}) as {
    imageUrl?: string;
  };

  return (
    <>
      <HeroSection
        eyebrow={hero.eyebrow ?? "Home Textile Manufacturing · USA & Canada"}
        title={hero.title ?? "Luxury in Every Thread."}
        subtitle={
          hero.subtitle ??
          "Premium cotton towels, hotel linen & private-label manufacturing — crafted in Solapur, India, and delivered with export-grade reliability across North America."
        }
        slides={hero.slides}
        imageCacheVersion={homePage?.updatedAt}
      />

      <TrustStrip certifications={certifications} />

      {/* About */}
      <section
        id="about"
        className="scroll-mt-28 py-section-mobile md:py-section-desktop"
      >
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <FadeUp>
              <SectionHeading
                eyebrow={heritage.eyebrow ?? "Our Story"}
                title={
                  heritage.title ??
                  "A premium textile manufacturer, built for North American buyers."
                }
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="font-body text-base leading-relaxed text-muted md:text-[16.5px]">
                <p>
                  Mist & Haven Living is a premium textile manufacturing and export
                  company headquartered in Solapur, Maharashtra — one of the
                  world&apos;s renowned towel-manufacturing hubs.
                </p>
                <p className="mt-4">
                  {heritage.description ??
                    "We supply high-quality cotton towels, bath linen, hospitality textiles, and private-label solutions to importers, distributors, retailers, hospitality buyers, and brands across the United States and Canada — with consistent quality and reliable global delivery support."}
                </p>
                <Link
                  href="/about"
                  className="mt-6 inline-flex items-center gap-2 border-b border-sage-deep pb-1 font-body text-[12.5px] uppercase tracking-[0.14em] text-taupe transition-colors hover:text-sage-deep"
                >
                  Read our full story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-taupe py-16 md:py-20">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StatStrip stats={companyStats} limit={4} />
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="scroll-mt-28 bg-oat py-section-mobile md:py-section-desktop"
      >
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Product Portfolio"
              title="A complete range of premium textiles"
              align="center"
              className="mx-auto mb-12 md:mb-14"
            />
          </FadeUp>
          <ProductMarquee categories={productCategories} />
          <CategoryGrid categories={productCategories} columns={4} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="The reliability buyers return for"
              className="mb-12 md:mb-14"
            />
          </FadeUp>
          <FeatureGrid features={whyChooseUsFeatures} />
        </div>
      </section>

      {/* Solutions */}
      <section
        id="solutions"
        className="scroll-mt-28 bg-oat py-section-mobile md:py-section-desktop"
      >
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Solutions For"
              title="Built around how you buy"
              align="center"
              className="mx-auto mb-12 md:mb-14"
            />
          </FadeUp>
          <SolutionsSection segments={audienceSegments} />
        </div>
      </section>

      {/* Manufacturing */}
      <section
        id="manufacturing"
        className="scroll-mt-28 py-section-mobile md:py-section-desktop"
      >
        <div className="mx-auto max-w-container px-6 md:px-8">
          <ManufacturingSection
            steps={manufacturingHighlights}
            imageUrl={manufacturingSection.imageUrl}
            imageCacheVersion={homePage?.updatedAt}
          />
        </div>
      </section>

      <CTABand variant="centered" />

      <HomeInquirySection />
    </>
  );
}
