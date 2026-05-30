"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import { STAGGER_DELAY_S } from "@/components/motion/constants";
import { cn } from "@/lib/utils";

type StaggerChildrenProps = {
  children: ReactNode;
  className?: string;
  /** Stagger between children in seconds (default ~90ms) */
  staggerDelay?: number;
};

export function StaggerChildren({
  children,
  className,
  staggerDelay = STAGGER_DELAY_S,
}: StaggerChildrenProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div className={cn(className)}>
      {items.map((child, index) => (
        <FadeUp key={child.key ?? index} delay={index * staggerDelay}>
          {child}
        </FadeUp>
      ))}
    </div>
  );
}
