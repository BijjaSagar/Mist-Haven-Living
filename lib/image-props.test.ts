import { describe, expect, it } from "vitest";
import {
  cmsImageSrc,
  coalesceCardImageForSave,
  resolveCmsImage,
  resolveProductCardImage,
  sanitizeCmsImagePath,
} from "./image-props";

describe("resolveProductCardImage", () => {
  it("prefers uploaded cardImage over picsum", () => {
    expect(
      resolveProductCardImage({
        cardImage: "/uploads/products/bath-towels/1781184477170-card.jpeg",
        heroImage: "https://picsum.photos/seed/bath-towels/1400/900",
      }),
    ).toBe("/uploads/products/bath-towels/1781184477170-card.jpeg");
  });

  it("falls back to uploaded hero when card is picsum", () => {
    expect(
      resolveProductCardImage({
        cardImage: "https://picsum.photos/seed/bath-towels-card/800/600",
        heroImage: "/uploads/products/bath-towels/1781184477170-hero.jpeg",
      }),
    ).toBe("/uploads/products/bath-towels/1781184477170-hero.jpeg");
  });

  it("falls back to gallery upload when card and hero are picsum", () => {
    expect(
      resolveProductCardImage({
        cardImage: "https://picsum.photos/seed/bath-towels-card/800/600",
        heroImage: "https://picsum.photos/seed/bath-towels/1400/900",
        galleryImages: [
          "https://picsum.photos/seed/gallery/600/600",
          "/uploads/products/bath-towels/1781184477170-gallery.jpeg",
        ],
      }),
    ).toBe("/uploads/products/bath-towels/1781184477170-gallery.jpeg");
  });

  it("returns picsum only when no uploads exist", () => {
    const picsum = "https://picsum.photos/seed/bath-towels-card/800/600";
    expect(
      resolveProductCardImage({
        cardImage: picsum,
        heroImage: "https://picsum.photos/seed/bath-towels/1400/900",
        galleryImages: [],
      }),
    ).toBe(picsum);
  });
});

describe("coalesceCardImageForSave", () => {
  it("upgrades picsum cardImage to first gallery upload on save", () => {
    expect(
      coalesceCardImageForSave({
        cardImage: "https://picsum.photos/seed/bath-towels-card/800/600",
        heroImage: "https://picsum.photos/seed/bath-towels/1400/900",
        galleryImages: [
          "/uploads/products/bath-towels/1781203583220-qc8z5zylep.jpeg",
        ],
      }),
    ).toBe("/uploads/products/bath-towels/1781203583220-qc8z5zylep.jpeg");
  });

  it("keeps explicit uploaded cardImage", () => {
    const card = "/uploads/products/bath-towels/1781184477170-card.jpeg";
    expect(
      coalesceCardImageForSave({
        cardImage: card,
        heroImage: "/uploads/products/bath-towels/1781203578660-hero.jpeg",
        galleryImages: ["/uploads/products/bath-towels/1781203583220-gallery.jpeg"],
      }),
    ).toBe(card);
  });
});

describe("sanitizeCmsImagePath", () => {
  it("removes corrupted ISO time suffix merged into path", () => {
    expect(sanitizeCmsImagePath("/uploads/pages/manuf_09:42:38.470Z")).toBe(
      "/uploads/pages/manuf",
    );
    expect(
      sanitizeCmsImagePath("/uploads/pages/manuf_09%3A42%3A38.470Z"),
    ).toBe("/uploads/pages/manuf");
  });

  it("preserves valid upload filenames", () => {
    expect(
      sanitizeCmsImagePath(
        "/uploads/pages/home-manufacturing/1781168582844-1i4xjcdvwyl.jpeg",
      ),
    ).toBe("/uploads/pages/home-manufacturing/1781168582844-1i4xjcdvwyl.jpeg");
  });
});

describe("cmsImageSrc", () => {
  it("appends ?v= as query only, never into path", () => {
    const iso = "2024-06-11T09:42:38.470Z";
    const out = cmsImageSrc("/uploads/pages/manuf", iso);
    expect(out).toMatch(/^\/uploads\/pages\/manuf\?v=\d+$/);
    expect(out).not.toContain(":");
    expect(out).not.toContain("_09");
  });

  it("normalizes ISO updatedAt to epoch milliseconds", () => {
    const iso = "2024-06-11T09:42:38.470Z";
    const ms = String(Date.parse(iso));
    expect(cmsImageSrc("/logo.png", iso)).toBe(`/logo.png?v=${ms}`);
  });

  it("prefers upload filename timestamp over page updatedAt", () => {
    const path =
      "/uploads/pages/home-hero/1780896363565-55tzqi6cmwi.jpeg";
    expect(cmsImageSrc(path, "2024-06-11T09:42:38.470Z")).toBe(
      `${path}?v=1780896363565`,
    );
  });

  it("repairs corrupted path and adds proper query param", () => {
    const out = cmsImageSrc(
      "/uploads/pages/manuf_09%3A42%3A38.470Z",
      "2024-06-11T09:42:38.470Z",
    );
    expect(out.startsWith("/uploads/pages/manuf?v=")).toBe(true);
    expect(out).not.toContain("%3A");
    expect(out).not.toContain("_09");
  });

  it("leaves remote URLs unchanged", () => {
    const url = "https://picsum.photos/seed/hero/1920/800";
    expect(cmsImageSrc(url, "2024-06-11T09:42:38.470Z")).toBe(url);
  });

  it("does not double-append v=", () => {
    const first = cmsImageSrc("/logo.png", new Date("2024-06-11T09:42:38.470Z"));
    expect(cmsImageSrc(first, "2025-01-01T00:00:00.000Z")).toBe(first);
  });
});

describe("resolveCmsImage", () => {
  it("marks uploads as unoptimized using sanitized path", () => {
    expect(
      resolveCmsImage("/uploads/pages/manuf_09:42:38.470Z", "2024-06-11T09:42:38.470Z"),
    ).toEqual({
      src: expect.stringMatching(/^\/uploads\/pages\/manuf\?v=\d+$/),
      unoptimized: true,
    });
  });
});
