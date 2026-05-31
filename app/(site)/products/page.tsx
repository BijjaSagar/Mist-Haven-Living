import { createMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FadeUp } from "@/components/motion/FadeUp";
import { CTABand } from "@/components/CTABand";
import { getProductCategories } from "@/lib/data/products";

export const metadata = createMetadata({
  title: "Products",
  description:
    "Explore our full range of premium B2B textile products—bath towels, hotel linen, spa towels, private label, and more for USA and Canada export.",
  path: "/products",
});

export const revalidate = 86400;

export default async function ProductsPage() {
  const productCategories = await getProductCategories();
  return (
    <>
      <section className="pt-32 pb-12 md:pb-16">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              Export Catalogue
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
              Premium textiles for every channel
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
              Twelve product categories engineered for hospitality, retail, spa,
              and private label buyers. Each specification page includes GSM ranges,
              sizes, materials, customization, and packaging options.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <CategoryGrid categories={productCategories} columns={3} />
        </div>
      </section>

      <section className="border-t border-hairline bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Need Guidance?"
              title="Not sure which category fits your program?"
              description="Our export team can recommend products based on your channel, price point, and laundering requirements. Request a consultation with no obligation."
            />
          </FadeUp>
        </div>
      </section>

      <CTABand />
    </>
  );
}
