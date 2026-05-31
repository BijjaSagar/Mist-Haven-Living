"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "header" | "footer";
  className?: string;
  onNavigate?: () => void;
};

export function BrandLogo({
  variant = "header",
  className,
  onNavigate,
}: BrandLogoProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isFooter = variant === "footer";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href="/"
      onClick={onNavigate}
      className={cn(
        "logo rv inline-flex flex-col items-start transition-opacity hover:opacity-90",
        revealed && "in",
        className,
      )}
      aria-label="Mist Haven Living — Home"
    >
      <span
        className={cn(
          "mh font-display text-[25px] font-medium leading-none",
          isFooter ? "text-pearl" : "text-taupe",
        )}
      >
        Mist Haven
      </span>
      <svg
        className="wave mt-0.5 h-2 w-[78px] shrink-0"
        viewBox="0 0 78 8"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 5 C 14 0.5, 26 0.5, 39 4.2 S 64 8, 76 3"
          stroke="var(--sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        className={cn(
          "lv mt-0.5 font-body text-[9px] uppercase tracking-[0.42em]",
          isFooter ? "text-pearl" : "text-taupe",
        )}
      >
        LIVING
      </span>
    </Link>
  );
}

