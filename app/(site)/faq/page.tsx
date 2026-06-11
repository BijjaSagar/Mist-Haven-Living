import Image from "next/image";
import { createMetadata, faqJsonLd } from "@/lib/seo";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { resolveCmsImage } from "@/lib/image-props";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPageContent } from "@/lib/data/pages";
import type { FaqItem } from "@/lib/types/cms";

export async function generateMetadata() {
  const page = await getPageContent("faq");
  return createMetadata({
    title: page?.metaTitle ?? "FAQ",
    description:
      page?.metaDescription ??
      "Frequently asked questions about MOQs, samples, lead times, shipping, payment terms, customization, and certifications for Mist & Haven Living export buyers.",
    path: "/faq",
  });
}

export const revalidate = 86400;

export default async function FaqPage() {
  const page = await getPageContent("faq");
  const hero = (page?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  const faqItems = (page?.sections.faqItems ?? []) as FaqItem[];
  const jsonLd = faqJsonLd(faqItems);

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
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              {...resolveCmsImage(hero.imageUrl, page?.updatedAt)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pearl/90 via-pearl/75 to-pearl" />
          </div>
          <div className="relative mx-auto max-w-container px-6 pb-section-mobile md:px-8 md:pb-section-desktop">
            <FadeUp>
              <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                {hero.eyebrow ?? "FAQ"}
              </p>
              <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-[4rem]">
                {hero.title ?? "Export buyer questions, answered"}
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
                {hero.description ??
                  "MOQs, sampling, lead times, shipping, payment, customization, and certifications—everything procurement teams ask before their first order."}
              </p>
            </FadeUp>
          </div>
        </section>
      ) : (
        <section className="pt-32 pb-section-mobile md:pb-section-desktop">
          <div className="mx-auto max-w-container px-6 md:px-8">
            <FadeUp>
              <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
                {hero.eyebrow ?? "FAQ"}
              </p>
              <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-[4rem]">
                {hero.title ?? "Export buyer questions, answered"}
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
                {hero.description ??
                  "MOQs, sampling, lead times, shipping, payment, customization, and certifications—everything procurement teams ask before their first order."}
              </p>
            </FadeUp>
          </div>
        </section>
      )}

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          {faqItems.length === 0 ? (
            <EmptyState
              title="FAQs are being updated"
              description="Our team is refreshing answers for export buyers. Reach out directly and we will respond within one business day."
              actionLabel="Contact export team"
              actionHref="/contact"
              className="max-w-3xl"
            />
          ) : (
            <Accordion type="single" collapsible className="max-w-3xl">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      <CTABand showForm={false} />
    </>
  );
}
