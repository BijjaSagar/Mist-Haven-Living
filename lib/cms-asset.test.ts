import { describe, expect, it, beforeEach, afterEach } from "vitest";
import path from "path";
import {
  mimeTypeForCmsAsset,
  normalizeCmsUploadPath,
  resolveCmsUploadDiskPath,
} from "./cms-asset";
import { adminCmsImageSrc } from "./image-props";

describe("normalizeCmsUploadPath", () => {
  it("adds leading slash and strips query params", () => {
    expect(normalizeCmsUploadPath("uploads/pages/home-hero/file.jpeg?v=1")).toBe(
      "/uploads/pages/home-hero/file.jpeg",
    );
  });
});

describe("resolveCmsUploadDiskPath", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, UPLOADS_DIR: "/tmp/mist-cms-uploads" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("maps public upload URLs into persistent storage", () => {
    expect(
      resolveCmsUploadDiskPath(
        "/uploads/pages/home-hero/1781202697992-4bwjnbnp3mc.jpeg",
      ),
    ).toBe(
      path.join(
        "/tmp/mist-cms-uploads",
        "pages",
        "home-hero",
        "1781202697992-4bwjnbnp3mc.jpeg",
      ),
    );
  });

  it("rejects traversal attempts", () => {
    expect(resolveCmsUploadDiskPath("/uploads/../etc/passwd")).toBeNull();
    expect(resolveCmsUploadDiskPath("/catalog/foo.png")).toBeNull();
  });
});

describe("mimeTypeForCmsAsset", () => {
  it("returns image mime types", () => {
    expect(mimeTypeForCmsAsset("/tmp/photo.jpeg")).toBe("image/jpeg");
    expect(mimeTypeForCmsAsset("/tmp/icon.png")).toBe("image/png");
  });
});

describe("adminCmsImageSrc", () => {
  it("routes upload paths through the admin asset API", () => {
    const src =
      "/uploads/pages/home-hero/1781202697992-4bwjnbnp3mc.jpeg";
    expect(adminCmsImageSrc(src)).toBe(
      "/api/admin/cms-asset?path=%2Fuploads%2Fpages%2Fhome-hero%2F1781202697992-4bwjnbnp3mc.jpeg&v=1781202697992",
    );
  });

  it("leaves remote URLs unchanged", () => {
    const url = "https://picsum.photos/seed/hero/1920/800";
    expect(adminCmsImageSrc(url)).toBe(url);
  });

  it("keeps static brand assets on public paths", () => {
    expect(adminCmsImageSrc("/logo.png", "2024-06-11T09:42:38.470Z")).toMatch(
      /^\/logo\.png\?v=\d+$/,
    );
  });
});
