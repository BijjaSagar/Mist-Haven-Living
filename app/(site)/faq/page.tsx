import { createMetadata, faqJsonLd } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/products";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about MOQs, samples, lead times, shipping, payment terms, customization, and certifications for Mist & Haven Living export buyers.",
  path: "/faq",
});

export const revalidate = 86400;

export default function FaqPage() {
  const jsonLd = faqJsonLd(faqItems);

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
              FAQ
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-[4rem]">
              Export buyer questions, answered
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
              MOQs, sampling, lead times, shipping, payment, customization, and
              certifications—everything procurement teams ask before their first order.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <Accordion type="single" collapsible className="max-w-3xl">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTABand showForm={false} />
    </>
  );
}
