"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
