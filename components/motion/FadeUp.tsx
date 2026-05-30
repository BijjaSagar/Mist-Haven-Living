"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FADE_UP_DURATION,
  FADE_UP_EASE,
  FADE_UP_VIEWPORT_AMOUNT,
} from "@/components/motion/constants";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motion;
};

export function FadeUp({
  children,
  className,
  delay = 0,
  as = "div",
}: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: FADE_UP_VIEWPORT_AMOUNT }}
      transition={{ duration: FADE_UP_DURATION, delay, ease: FADE_UP_EASE }}
    >
      {children}
    </Component>
  );
}
