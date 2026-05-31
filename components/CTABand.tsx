import Link from "next/link";
import { MultiStepInquiryForm } from "@/components/MultiStepInquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { getProductInterestOptions } from "@/lib/data/products";

type CTABandProps = {
  prefilledProduct?: string;
  showForm?: boolean;
};

export async function CTABand({
  prefilledProduct,
  showForm = true,
}: CTABandProps) {
  const productInterestOptions = await getProductInterestOptions();

  return (
    <section className="bg-taupe py-section-mobile md:py-section-desktop">
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Start Your Order"
              title="Request a quote for USA & Canada export"
              description="Share your specifications, quantities, and timeline. Our export team responds within one business day with pricing, lead times, and sampling options."
              dark
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center border border-pearl/30 px-6 font-body text-sm text-pearl transition-colors hover:border-pearl hover:bg-pearl/10"
              >
                Contact our team
              </Link>
              <Link
                href="/products"
                className="inline-flex h-11 items-center px-6 font-body text-sm text-pearl/70 transition-colors hover:text-pearl"
              >
                Browse all products →
              </Link>
            </div>
          </div>
          {showForm && (
            <div className="border border-pearl/15 bg-pearl/5 p-6 md:p-8">
              <MultiStepInquiryForm
                prefilledProduct={prefilledProduct}
                variant="dark"
                productInterestOptions={productInterestOptions}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
