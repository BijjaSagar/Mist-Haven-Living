import { SectionHeading } from "@/components/SectionHeading";
import { ContactEmails } from "@/components/ContactEmails";
import { MultiStepInquiryForm } from "@/components/MultiStepInquiryForm";
import { FadeUp } from "@/components/motion/FadeUp";
import { WaveUnderline } from "@/components/WaveDivider";
import { getProductInterestOptions } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function HomeInquirySection() {
  const [settings, productInterestOptions] = await Promise.all([
    getSiteSettings(),
    getProductInterestOptions(),
  ]);

  return (
    <section id="contact" className="scroll-mt-28 bg-oat py-section-mobile md:py-section-desktop">
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <FadeUp>
            <p className="font-body text-[11.5px] font-medium uppercase tracking-[0.28em] text-sage-deep">
              Get In Touch
            </p>
            <p className="mt-3.5 font-display text-2xl leading-snug text-taupe md:text-[24px]">
              Start a conversation with our export team.
            </p>
            <WaveUnderline className="mt-3.5" />
            <div className="mt-7 space-y-2 font-body text-[14.5px] text-muted">
              <p>
                <strong className="font-medium text-taupe">Manufacturing:</strong>{" "}
                {settings.legalName}, {settings.address.city},{" "}
                {settings.address.region}, {settings.address.country}
              </p>
              <p>
                <strong className="font-medium text-taupe">Email:</strong>{" "}
                <ContactEmails
                  primary={settings.contactEmail}
                  secondary={settings.contactEmailSecondary}
                  layout="inline"
                  linkClassName="hover:text-sage-deep"
                />
              </p>
              {settings.contactPhone ? (
                <p>
                  <strong className="font-medium text-taupe">Phone:</strong>{" "}
                  <a
                    href={`tel:${settings.contactPhone.replace(/\D/g, "")}`}
                    className="hover:text-sage-deep"
                  >
                    {settings.contactPhone}
                  </a>
                </p>
              ) : null}
              {settings.whatsappNumber ? (
                <p>
                  <strong className="font-medium text-taupe">WhatsApp:</strong>{" "}
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                    className="hover:text-sage-deep"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {settings.whatsappNumber}
                  </a>
                </p>
              ) : null}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="border border-hairline bg-pearl p-7 md:p-10">
              <SectionHeading
                eyebrow="Request Quote"
                title="Tell us about your project"
                description="Complete the two-step form and our export specialists will respond with pricing, lead times, and sampling options."
                className="mb-8"
                showWave={false}
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
  );
}
