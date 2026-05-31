"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
};

const SLIDES = [
  {
    image: "https://picsum.photos/seed/mist-bath/900/1125",
    caption: "Premium Bath Towels",
  },
  {
    image: "https://picsum.photos/seed/mist-hotel/900/1125",
    caption: "Hotel & Spa Linen",
  },
  {
    image: "https://picsum.photos/seed/mist-private/900/1125",
    caption: "Private-Label Programs",
  },
] as const;

const SLIDE_INTERVAL_MS = 5500;

export function HeroSection({
  eyebrow = "Home Textile Manufacturing · USA & Canada",
  title = "Luxury in Every Thread.",
  subtitle = "Premium cotton towels, hotel linen & private-label manufacturing — crafted in Solapur, India, and delivered with export-grade reliability across North America.",
  imageUrl,
}: HeroSectionProps) {
  const titleParts = title.match(/^(.+?)\s+(in)\s+(.+)$/i);
  const shouldReduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  const slides = imageUrl
    ? [{ image: imageUrl, caption: SLIDES[0].caption }, ...SLIDES.slice(1)]
    : SLIDES;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, slides.length]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const frame = frameRef.current;
    if (!frame) return;

    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.06, 48);
      frame.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldReduceMotion]);

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

        <FadeUp
          delay={0.15}
          className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none"
        >
          <div ref={frameRef} className="hero-frame relative will-change-transform">
            <div
              className="hero-ring absolute -right-4 -top-4 h-28 w-28 rounded-full border border-sage opacity-60 md:-right-6 md:-top-6 md:h-[120px] md:w-[120px]"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-oat">
              {slides.map((slide, index) => (
                <div
                  key={slide.caption}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
                    index === activeSlide ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={slide.image}
                    alt={slide.caption}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 1024px) 90vw, 45vw"
                  />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-taupe/55 to-transparent px-5 pb-5 pt-16">
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-pearl">
                  {slides[activeSlide].caption}
                </p>
              </div>
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
