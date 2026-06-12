import { describe, expect, it, beforeEach, afterEach } from "vitest";
import path from "path";
import {
  defaultPersistentUploadsDir,
  isFlatStandaloneDeploy,
  isStandaloneDeploy,
  resolveAppRoot,
  resolveUploadsStorageDir,
  resolveUploadDir,
  sanitizeUploadSegment,
} from "./uploads";

describe("sanitizeUploadSegment", () => {
  it("normalizes slug-like segments", () => {
    expect(sanitizeUploadSegment("Hand Towels")).toBe("hand-towels");
    expect(sanitizeUploadSegment("")).toBe("misc");
  });
});

describe("resolveUploadsStorageDir", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.PERSISTENT_UPLOADS_PATH;
    delete process.env.UPLOADS_DIR;
    delete process.env.PUBLIC_DIR;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("uses PERSISTENT_UPLOADS_PATH when set", () => {
    process.env.PERSISTENT_UPLOADS_PATH = "/var/cms/uploads-data";
    expect(resolveUploadsStorageDir()).toBe("/var/cms/uploads-data");
  });

  it("uses UPLOADS_DIR when set", () => {
    process.env.UPLOADS_DIR = "/data/uploads";
    expect(resolveUploadsStorageDir()).toBe("/data/uploads");
  });

  it("defaults persistent dir to sibling uploads-data for standalone deploys", () => {
    const cwd = "/home/user/domains/mistandhaven.com/nodejs";
    expect(defaultPersistentUploadsDir(cwd)).toBe(
      "/home/user/domains/mistandhaven.com/uploads-data",
    );
  });

  it("resolveAppRoot walks up from nested standalone cwd to app root", () => {
    const appRoot = "/home/user/domains/mistandhaven.com/nodejs";
    expect(resolveAppRoot(appRoot)).toBe(appRoot);
  });

  it("detects non-standalone dev cwd", () => {
    const tmp = "/tmp/mist-vitest-non-standalone-cwd";
    expect(isFlatStandaloneDeploy(tmp)).toBe(false);
    expect(isStandaloneDeploy(tmp)).toBe(false);
  });
});

describe("resolveUploadDir", () => {
  beforeEach(() => {
    process.env.UPLOADS_DIR = "/tmp/mist-test-uploads";
  });

  afterEach(() => {
    delete process.env.UPLOADS_DIR;
  });

  it("builds nested product folder paths", () => {
    const { diskPath, publicPrefix } = resolveUploadDir("products/hand-towels");
    expect(publicPrefix).toBe("/uploads/products/hand-towels");
    expect(diskPath).toBe(
      path.join("/tmp/mist-test-uploads", "products", "hand-towels"),
    );
  });
});
