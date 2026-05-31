import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { StatStrip } from "@/components/StatStrip";
import { CTABand } from "@/components/CTABand";
import { FadeUp } from "@/components/motion/FadeUp";
import { getStats } from "@/lib/data/stats";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPageContent } from "@/lib/data/pages";

export async function generateMetadata() {
  const page = await getPageContent("about");
  return createMetadata({
    title: page?.metaTitle ?? "About Us",
    description:
      page?.metaDescription ??
      "Learn about Mist & Haven Living—four decades of premium textile manufacturing in Solapur, India, exporting to USA and Canada.",
    path: "/about",
  });
}

export const revalidate = 86400;

export default async function AboutPage() {
  const [companyStats, settings, aboutPage] = await Promise.all([
    getStats(),
    getSiteSettings(),
    getPageContent("about"),
  ]);

  const hero = (aboutPage?.sections.hero ?? {}) as {
    eyebrow?: string;
    title?: string;
  };
  const intro = (aboutPage?.sections.intro ?? {}) as {
    title?: string;
    body?: string;
  };
  return (
    <>
      <section className="pt-32 pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
              {hero.eyebrow ?? "Our Story"}
            </p>
            <h1 className="max-w-3xl font-display text-4xl text-taupe md:text-5xl lg:text-6xl">
              {hero.title ?? "Where heritage meets export excellence"}
            </h1>
          </FadeUp>
        </div>
      </section>

      <section className="pb-section-mobile md:pb-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <FadeUp className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden bg-oat">
                <Image
                  src="https://picsum.photos/seed/about-factory/800/1067"
                  alt="Mist & Haven Living team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-7 lg:pl-8">
              <SectionHeading
                title={intro.title ?? "Mist & Haven Living — Est. 1982, Solapur"}
                description={
                  intro.body ??
                  "Solapur has been India's terry towel capital for over a century. Mist & Haven Living was founded here in 1982 with a singular focus: produce textiles that meet the exacting standards of international hospitality and retail buyers."
                }
              />
              <div className="mt-8 space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Mist & Haven Living is our export brand—designed specifically for
                  B2B buyers in the United States and Canada who require consistent
                  GSM, reliable lead times, and complete export documentation.
                </p>
                <p>
                  Our facility spans over 120,000 square feet with in-house weaving,
                  dyeing, finishing, cutting, stitching, and quality laboratories.
                  We employ 400+ skilled craftspeople and maintain certifications
                  including ISO 9001, OEKO-TEX, GOTS, BSCI, and SEDEX.
                </p>
                <p>
                  Whether you are a five-star hotel group replenishing par levels, a
                  retail chain launching a home collection, or an emerging brand
                  building a private label program—we partner with you from sampling
                  through shipment.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="border-y border-hairline bg-taupe py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <StatStrip stats={companyStats} dark />
        </div>
      </section>

      <section className="py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-container px-6 md:px-8">
          <FadeUp>
            <SectionHeading
              eyebrow="Our Values"
              title="What guides every production run"
              className="mb-12"
            />
          </FadeUp>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Consistency",
                text: "±5% GSM tolerance and colour matching across every batch—non-negotiable for hospitality procurement.",
              },
              {
                title: "Transparency",
                text: "Open factory visits, third-party audits, and clear communication at every stage of production.",
              },
              {
                title: "Partnership",
                text: "We grow with our buyers—from first sample to multi-year supply agreements.",
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.05}>
                <div className="border-t border-hairline pt-6">
                  <h3 className="font-display text-xl text-taupe">{item.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
          <p className="mt-12 font-body text-sm text-muted">
            Ready to partner?{" "}
            <Link href="/contact" className="text-sage-deep hover:underline">
              Contact our export team
            </Link>{" "}
            or email{" "}
            <a
              href={`mailto:${settings.contactEmail}`}
              className="text-sage-deep hover:underline"
            >
              {settings.contactEmail}
            </a>
          </p>
        </div>
      </section>

      <CTABand showForm={false} />
    </>
  );
}
