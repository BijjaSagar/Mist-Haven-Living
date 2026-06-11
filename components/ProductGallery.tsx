"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveCmsImage, type CacheVersion } from "@/lib/image-props";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  /** Optional hero — included as first lightbox slide when not already in `images`. */
  heroImage?: string;
  productName: string;
  cacheVersion?: CacheVersion;
  className?: string;
};

function dedupeImages(images: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const src of images) {
    const trimmed = src.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export function ProductGallery({
  images,
  heroImage,
  productName,
  cacheVersion,
  className,
}: ProductGalleryProps) {
  const gridImages = useMemo(() => dedupeImages(images), [images]);

  const lightboxSlides = useMemo(() => {
    const hero = heroImage?.trim();
    if (hero && !gridImages.includes(hero)) {
      return dedupeImages([hero, ...gridImages]);
    }
    return gridImages;
  }, [gridImages, heroImage]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const openLightbox = useCallback(
    (gridIndex: number) => {
      const src = gridImages[gridIndex];
      const slideIndex = lightboxSlides.indexOf(src);
      const index = slideIndex >= 0 ? slideIndex : gridIndex;
      console.log("[ProductGallery] openLightbox", {
        gridIndex,
        slideIndex: index,
        total: lightboxSlides.length,
      });
      setActiveIndex(index);
      setLightboxOpen(true);
    },
    [gridImages, lightboxSlides],
  );

  const goTo = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        const next =
          (current + delta + lightboxSlides.length) % lightboxSlides.length;
        console.log("[ProductGallery] goTo", { from: current, to: next, delta });
        return next;
      });
    },
    [lightboxSlides.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, goTo]);

  if (gridImages.length === 0) {
    return null;
  }

  const activeSrc = lightboxSlides[activeIndex];
  const activeResolved = resolveCmsImage(activeSrc, cacheVersion);

  return (
    <>
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
        role="list"
        aria-label={`${productName} image gallery`}
      >
        {gridImages.map((src, index) => {
          const resolved = resolveCmsImage(src, cacheVersion);
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              role="listitem"
              aria-label={`View ${productName} image ${index + 1} of ${gridImages.length}`}
              className="group relative aspect-[4/3] overflow-hidden bg-pearl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={resolved.src}
                unoptimized={resolved.unoptimized}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-taupe/0 transition-colors group-hover:bg-taupe/10" />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-pearl/90 text-taupe opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-5xl border-hairline bg-pearl p-0 sm:p-0"
          aria-describedby={undefined}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (Math.abs(delta) < 40) return;
            goTo(delta > 0 ? -1 : 1);
          }}
        >
          <DialogTitle className="sr-only">
            {productName} gallery — image {activeIndex + 1} of{" "}
            {lightboxSlides.length}
          </DialogTitle>

          <div className="relative aspect-[4/3] w-full bg-oat sm:aspect-[16/10]">
            <Image
              key={activeSrc}
              src={activeResolved.src}
              unoptimized={activeResolved.unoptimized}
              alt={`${productName} ${activeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-contain"
              priority
            />

            {lightboxSlides.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-pearl/95 text-taupe transition-colors hover:bg-oat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  onClick={() => goTo(-1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  className="absolute right-12 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-pearl/95 text-taupe transition-colors hover:bg-oat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage sm:right-3"
                  onClick={() => goTo(1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
            <p className="font-body text-xs uppercase tracking-[0.18em] text-muted">
              {activeIndex + 1} / {lightboxSlides.length}
            </p>
            {lightboxSlides.length > 1 ? (
              <div className="flex flex-wrap justify-end gap-2">
                {lightboxSlides.map((src, index) => {
                  const thumb = resolveCmsImage(src, cacheVersion);
                  return (
                    <button
                      key={`thumb-${src}-${index}`}
                      type="button"
                      aria-label={`Show image ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      className={cn(
                        "relative h-12 w-16 overflow-hidden border bg-oat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage",
                        index === activeIndex
                          ? "border-sage-deep ring-1 ring-sage-deep"
                          : "border-hairline opacity-80 hover:opacity-100",
                      )}
                      onClick={() => setActiveIndex(index)}
                    >
                      <Image
                        src={thumb.src}
                        unoptimized={thumb.unoptimized}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
