"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ParsedStat = {
  target: number;
  prefix: string;
  numeric: string;
  suffix: string;
  /** Plain integer with optional trailing "+" only — safe to count up */
  animate: boolean;
};

function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { target: 0, prefix: "", numeric: "", suffix: value, animate: false };
  }

  const numeric = match[2];
  const target = parseFloat(numeric);
  const suffix = match[3];
  const animate =
    Number.isInteger(target) && /^\+?$/.test(suffix) && target > 0;

  return {
    prefix: match[1],
    numeric,
    target,
    suffix,
    animate,
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
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const { target, prefix, numeric, suffix, animate } = parsed;

  useEffect(() => {
    if (!animate) {
      setDisplay(target);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setDisplay(target);
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
  }, [animate, target]);

  useEffect(() => {
    if (!animate || !started) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setDisplay(target);
      return;
    }

    const step = Math.max(1, target / 60);
    let current = 0;
    let frameId = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        setDisplay(target);
      } else {
        setDisplay(Math.floor(current));
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [animate, started, target]);

  const suffixClass = dark ? "text-sage" : "text-sage-deep";
  const numberClass = "font-body lining-nums tabular-nums";
  const shownNumber = animate ? String(Math.round(display)) : numeric;

  return (
    <div ref={ref} className={className}>
      <p
        className={`font-display text-[clamp(2.625rem,5vw,4rem)] leading-none font-medium ${dark ? "text-pearl" : "text-taupe"}`}
      >
        {prefix}
        <span className={numberClass}>{shownNumber}</span>
        {suffix && <span className={suffixClass}>{suffix}</span>}
      </p>
      <p
        className={`mt-3.5 font-body text-[11.5px] uppercase tracking-[0.2em] ${dark ? "text-pearl/60" : "text-muted"}`}
      >
        {label}
      </p>
    </div>
  );
}
