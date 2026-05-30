"use client";

import Image, { type ImageProps } from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverScaleImageProps = ImageProps & {
  containerClassName?: string;
};

export function HoverScaleImage({
  containerClassName,
  className,
  ...imageProps
}: HoverScaleImageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        {...imageProps}
        className={cn(
          "object-cover",
          !shouldReduceMotion &&
            "transition-transform duration-300 ease-out group-hover:scale-[1.04]",
          shouldReduceMotion &&
            "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          className,
        )}
      />
    </div>
  );
}
