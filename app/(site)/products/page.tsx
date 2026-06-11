import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FadeUp } from "@/components/motion/FadeUp";
import { CTABand } from "@/components/CTABand";
import { resolveCmsImage } from "@/lib/image-props";
import { getProductCategories } from "@/lib/data/products";
import { getPageContent } from "@/lib/data/pages";

export async function generateMetadata() {
  const page = await getPageContent("products");
  return createMetadata({
    title: page?.metaTitle ?? "Products",
    description:
      page?.metaDescription ??
      "Explore our full range of premium B2B textile products—bath towels, hotel linen, spa towels, private label, and more for USA and Canada export.",
    path: "/products",
  });
}

/** Always fetch product categories from DB at runtime — never ISR-cache CI picsum placeholders. */
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [productCategories, page] = await Promise.all([
    getProductCategories(),
    getPageContent("products"),
  ]);
  const hero = (page?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  const heroContent = (
    <FadeUp>
      <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
        {hero.eyebrow ?? "Export Catalogue"}
      </p>
      <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
        {hero.title ?? "Premium textiles for every channel"}
      </h1>
      <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
        {hero.description ??
          "Twelve product categories engineered for hospitality, retail, spa, and private label buyers. Each specification page includes GSM ranges, sizes, materials, customization, and packaging options."}
      </p>
    </FadeUp>
  );

  return (
    <>
      {hero.imageUrl ? (
        <section className="relative min-h-[50vh] overflow-hidden pt-28">
          <div className="absolute inset-0">
            <Image
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              {...resolveCmsImage(hero.imageUrl, page?.updatedAt)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pearl/90 via-pearl/75 to-pearl" />
          </div>
          <div className="relative mx-auto max-w-container px-6 pb-12 md:px-8 md:pb-16">
            {heroContent}
          </div>
        </section>
      ) : (
        <section className="pt-32 pb-12 md:pb-16">
          <div className="mx-auto max-w-container px-6 md:px-8">
            {heroContent}
          </div>
        </section>
      )}

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
