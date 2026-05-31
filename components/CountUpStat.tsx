"use client";

import { useEffect, useRef, useState } from "react";

type ParsedStat = {
  target: number;
  prefix: string;
  suffix: string;
};

function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { target: 0, prefix: "", suffix: value };
  }
  return {
    prefix: match[1],
    target: parseFloat(match[2]),
    suffix: match[3],
  };
}

type CountUpStatProps = {
  value: string;
  label: string;
  dark?: boolean;
  className?: string;
};

export function CountUpStat({
  value,
  label,
  dark = false,
  className,
}: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const parsed = parseStatValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setDisplay(parsed.target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed.target]);

  useEffect(() => {
    if (!started) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setDisplay(parsed.target);
      return;
    }

    const { target } = parsed;
    const step = Math.max(1, target / 60);
    let current = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        setDisplay(target);
      } else {
        setDisplay(Math.floor(current));
        requestAnimationFrame(tick);
      }
    };

    tick();
  }, [started, parsed]);

  const suffixClass = dark ? "text-sage" : "text-sage-deep";

  return (
    <div ref={ref} className={className}>
      <p
        className={`font-display text-[clamp(2.625rem,5vw,4rem)] leading-none font-medium ${dark ? "text-pearl" : "text-taupe"}`}
      >
        {parsed.prefix}
        <span>{Number.isInteger(parsed.target) ? Math.round(display) : display.toFixed(0)}</span>
        {parsed.suffix && (
          <span className={suffixClass}>{parsed.suffix}</span>
        )}
      </p>
      <p
        className={`mt-3.5 font-body text-[11.5px] uppercase tracking-[0.2em] ${dark ? "text-pearl/60" : "text-muted"}`}
      >
        {label}
      </p>
    </div>
  );
}
