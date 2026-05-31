import { notFound } from "next/navigation";
import Link from "next/link";
import {
  createMetadata,
  productJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerChildren } from "@/components/motion/StaggerChildren";
import { HoverScaleImage } from "@/components/motion/HoverScaleImage";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
} from "@/lib/data/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return createMetadata({
    title: category.metaTitle ?? category.name,
    description: category.metaDescription ?? category.shortDescription,
    path: `/products/${slug}`,
    image: category.heroImage,
  });
}

export const revalidate = 86400;

export default async function ProductCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const jsonLd = [
    productJsonLd(
      category.name,
      category.description,
      category.slug,
      category.heroImage,
    ),
    serviceJsonLd(
      category.name,
      category.shortDescription,
      `/products/${category.slug}`,
    ),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-28">
        <FadeUp>
          <div className="group relative h-[50vh] min-h-[400px] overflow-hidden bg-oat">
            <HoverScaleImage
              src={category.heroImage}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              containerClassName="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-taupe/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="mx-auto max-w-container px-6 pb-12 md:px-8">
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: category.name },
                  ]}
                  className="mb-4 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/40"
                />
                <p className="mb-2 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                  {category.eyebrow}
                </p>
                <h1 className="font-display text-4xl text-white md:text-5xl">
                  {category.name}
                </h1>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StaggerChildren className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-body text-lg leading-relaxed text-muted">
                {category.description}
              </p>
              <StaggerChildren className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-hairline bg-oat p-6">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-muted">
                    GSM Range
                  </p>
                  <p className="mt-2 font-display text-2xl text-taupe">
                    {category.gsmRange}
                  </p>
                </div>
                <div className="border border-hairline bg-oat p-6">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-muted">
                    MOQ
                  </p>
                  <p className="mt-2 font-display text-xl text-taupe">
                    {category.moq}
                  </p>
                </div>
                <div className="border border-hairline bg-oat p-6">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-muted">
                    Lead Time
                  </p>
                  <p className="mt-2 font-display text-xl text-taupe">
                    {category.leadTime}
                  </p>
                </div>
                <div className="border border-hairline bg-oat p-6 sm:col-span-2">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-muted">
                    Ideal For
                  </p>
                  <p className="mt-2 font-body text-sm text-taupe">
                    {category.idealFor.join(" · ")}
                  </p>
                </div>
              </StaggerChildren>
            </div>
            <div className="lg:col-span-5">
              <SectionHeading title="Key Features" className="mb-6" />
              <ul className="space-y-3">
                {category.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 font-body text-sm text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-deep" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerChildren>
        </div>
      </section>

      <section className="border-y border-hairline bg-white py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StaggerChildren className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Materials", items: category.materials },
              { title: "Sizes", items: category.sizes.map((s) => `${s.label}: ${s.cm} (${s.inches})`) },
              { title: "Customization", items: category.customization },
              { title: "Packaging", items: category.packaging },
            ].map((block) => (
              <div key={block.title}>
                <h2 className="font-display text-xl text-taupe">{block.title}</h2>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="font-body text-sm leading-relaxed text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8 text-center">
          <FadeUp>
            <p className="font-body text-sm text-muted">
              Explore related categories or{" "}
              <Link href="/products" className="text-sage-deep hover:underline">
                view all products
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      <CTABand prefilledProduct={category.slug} />
    </>
  );
}
