import { createMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { MultiStepInquiryForm } from "@/components/MultiStepInquiryForm";
import { ScheduleDiscussion } from "@/components/ScheduleDiscussion";
import { CatalogCTA } from "@/components/CatalogGateModal";
import { FadeUp } from "@/components/motion/FadeUp";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getProductInterestOptions } from "@/lib/data/products";
import { getPageContent } from "@/lib/data/pages";
import { ContactEmails } from "@/components/ContactEmails";
import { MapPin, Clock, Mail, Phone } from "lucide-react";

export async function generateMetadata() {
  const page = await getPageContent("contact");
  return createMetadata({
    title: page?.metaTitle ?? "Contact",
    description:
      page?.metaDescription ??
      "Contact Mist & Haven Living export team for B2B textile inquiries. USA and Canada buyers welcome. Response within one business day.",
    path: "/contact",
  });
}

export const revalidate = 86400;

export default async function ContactPage() {
  const [settings, productInterestOptions] = await Promise.all([
    getSiteSettings(),
    getProductInterestOptions(),
  ]);
  return (
    <>
      <section className="pt-32 pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              Get In Touch
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-[4rem]">
              Speak with our export team
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted">
              Share your product requirements, quantities, and timeline. We respond
              to all B2B inquiries within one business day.
            </p>
            <div className="mt-6">
              <CatalogCTA />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <FadeUp className="lg:col-span-5">
              <SectionHeading title="Export Office" className="mb-8" />
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 shrink-0 text-sage-deep" />
                  <address className="not-italic font-body text-sm leading-relaxed text-muted">
                    <strong className="block text-taupe">{settings.legalName}</strong>
                    {settings.address.street}
                    <br />
                    {settings.address.city}, {settings.address.region}{" "}
                    {settings.address.postalCode}
                    <br />
                    {settings.address.country}
                  </address>
                </div>
                <div className="flex gap-4">
                  <Mail className="h-5 w-5 shrink-0 text-sage-deep" />
                  <ContactEmails
                    primary={settings.contactEmail}
                    secondary={settings.contactEmailSecondary}
                    linkClassName="font-body text-sm text-muted hover:text-sage-deep"
                  />
                </div>
                <div className="flex gap-4">
                  <Phone className="h-5 w-5 shrink-0 text-sage-deep" />
                  <a
                    href={`tel:${settings.contactPhone.replace(/\D/g, "")}`}
                    className="font-body text-sm text-muted hover:text-sage-deep"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 shrink-0 text-sage-deep" />
                  <span className="font-body text-sm text-muted">
                    Mon–Sat, 9:00 AM – 6:00 PM IST
                    <br />
                    Aligned support for US & Canada time zones
                  </span>
                </div>
              </div>

              <div className="mt-10 overflow-hidden border border-hairline">
                <iframe
                  title="Mist & Haven Living location — Solapur, India"
                  src="https://maps.google.com/maps?q=Solapur+Maharashtra+India&t=&z=11&ie=UTF8&iwloc=&output=embed"
                  className="h-64 w-full grayscale-[30%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-10">
                <ScheduleDiscussion calendlyUrl={settings.calendlyUrl} />
              </div>
            </FadeUp>

            <FadeUp delay={0.1} className="lg:col-span-7">
              <div
                id="inquiry"
                className="scroll-mt-28 border border-hairline bg-white p-6 md:p-10"
              >
                <SectionHeading
                  eyebrow="Request Quote"
                  title="Tell us about your project"
                  description="Complete the two-step form below and our export specialists will respond with pricing, lead times, and sampling options."
                  className="mb-8"
                />
                <MultiStepInquiryForm
                  productInterestOptions={productInterestOptions}
                  inquiryEnabled={settings.inquiryEnabled}
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
