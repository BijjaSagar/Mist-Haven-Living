"use client";

import Image, { type ImageProps } from "next/image";
import { useReducedMotion } from "framer-motion";
import { resolveCmsImage, type CacheVersion } from "@/lib/image-props";
import { cn } from "@/lib/utils";

type HoverScaleImageProps = ImageProps & {
  containerClassName?: string;
  cacheVersion?: CacheVersion;
};

export function HoverScaleImage({
  containerClassName,
  className,
  src,
  cacheVersion,
  ...imageProps
}: HoverScaleImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolved =
    typeof src === "string" ? resolveCmsImage(src, cacheVersion) : { src };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        {...resolved}
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
