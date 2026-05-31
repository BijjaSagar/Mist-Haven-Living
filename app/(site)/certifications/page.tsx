import { createMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { CertificationBadges } from "@/components/CertificationBadges";
import { SocialComplianceSection } from "@/components/SocialComplianceSection";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { socialCompliancePoints } from "@/data/products";
import { getCertifications } from "@/lib/data/certifications";

export const metadata = createMetadata({
  title: "Certifications",
  description:
    "ISO 9001:2015, OEKO-TEX Standard 100, BCI, GOTS, BSCI, and SEDEX/SMETA compliance for export textile manufacturing to USA and Canada.",
  path: "/certifications",
});

export const revalidate = 86400;

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <>
      <section className="pt-32 pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              Compliance
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-[4rem]">
              Certified for North American procurement standards
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
              ISO 9001:2015, OEKO-TEX Standard 100, and BCI membership—plus GOTS,
              BSCI, and SEDEX/SMETA readiness. Download certificate copies below
              or request batch-specific lab reports from our export team.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <CertificationBadges badges={certifications} />
        </div>
      </section>

      <section className="border-y border-hairline bg-oat py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Social Compliance"
              title="Ethical manufacturing statement"
              description="We maintain policies and audit readiness aligned with international social compliance frameworks expected by North American buyers."
              className="mb-12"
            />
          </FadeUp>
          <SocialComplianceSection points={socialCompliancePoints} />
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="FAQ"
              title="Common certification questions"
              className="mb-8"
            />
          </FadeUp>
          <Accordion type="single" collapsible className="max-w-3xl">
            <AccordionItem value="docs">
              <AccordionTrigger>
                Can you provide certificate copies for our procurement team?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Current certificates for ISO 9001, OEKO-TEX, BCI, GOTS, BSCI,
                and SEDEX are available for download on this page. We can also
                provide batch-specific test reports from our quality laboratory.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="organic">
              <AccordionTrigger>
                Do you offer GOTS-certified organic cotton programs?
              </AccordionTrigger>
              <AccordionContent>
                Yes. We maintain GOTS certification for organic cotton product
                lines. MOQs and lead times may differ from conventional cotton
                programs—contact our export team for details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="audit">
              <AccordionTrigger>
                Can we conduct a factory audit before placing an order?
              </AccordionTrigger>
              <AccordionContent>
                Absolutely. We welcome buyer audits and third-party inspections.
                Virtual factory tours are also available for initial qualification.
                Contact us to schedule.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <CTABand />
    </>
  );
}
