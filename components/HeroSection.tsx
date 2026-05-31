import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowRight } from "lucide-react";

type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
};

export function HeroSection({
  eyebrow = "Home Textile Manufacturing · USA & Canada",
  title = "Luxury in Every Thread.",
  subtitle = "Premium cotton towels, hotel linen & private-label manufacturing — crafted in Solapur, India, and delivered with export-grade reliability across North America.",
  imageUrl = "https://picsum.photos/seed/mist-hero/900/1125",
}: HeroSectionProps) {
  const titleParts = title.match(/^(.+?)\s+(in)\s+(.+)$/i);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(1200px 600px at 88% -5%, rgba(200,199,172,0.32), transparent 60%),
            radial-gradient(900px 500px at -5% 30%, rgba(231,221,205,0.6), transparent 55%),
            var(--pearl)
          `,
        }}
      />
      <div className="relative mx-auto grid max-w-container items-center gap-10 px-6 md:gap-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <FadeUp className="order-2 lg:order-1">
          <p className="font-body text-[11.5px] font-medium uppercase tracking-[0.28em] text-sage-deep">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.875rem,6.4vw,5.75rem)] font-medium leading-[1.08] tracking-tight text-taupe">
            {titleParts ? (
              <>
                {titleParts[1]}{" "}
                <span className="italic text-sage-deep">{titleParts[2]}</span>{" "}
                {titleParts[3]}
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-6 max-w-md font-body text-[17px] font-normal leading-relaxed text-muted">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/contact#inquiry" className="btn-solid group">
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <Link href="/products" className="btn-ghost">
              Explore Products
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.15} className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="relative">
            <div
              className="absolute -right-4 -top-4 h-28 w-28 rounded-full border border-sage opacity-60 md:-right-6 md:-top-6 md:h-[120px] md:w-[120px]"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-oat">
              <Image
                src={imageUrl}
                alt="Premium towel and hospitality textile manufacturing"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
            <div className="absolute -bottom-2 left-0 max-w-[230px] border border-hairline bg-white p-5 shadow-[0_30px_60px_-34px_rgba(74,67,57,0.55)] md:-left-8 md:bottom-10 md:p-6">
              <p className="font-display text-[2.125rem] leading-none text-taupe">
                100% Cotton
              </p>
              <p className="mt-2 font-body text-[11px] uppercase tracking-[0.16em] text-muted">
                OEKO-TEX® certified quality
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
