import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  // Limit build parallelism for shared hosting (CloudLinux LVE / EAGAIN on spawn)
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    config.parallelism = 1;
    return config;
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
  async headers() {
    const cmsAssetCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=3600, must-revalidate",
      },
    ];
    const staticBrandCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
    ];

    return [
      {
        source: "/uploads/:path*",
        headers: cmsAssetCache,
      },
      {
        source: "/catalog/:path*",
        headers: cmsAssetCache,
      },
      {
        source: "/certificates/:path*",
        headers: cmsAssetCache,
      },
      {
        source: "/logo.png",
        headers: staticBrandCache,
      },
      {
        source: "/logo-light.png",
        headers: staticBrandCache,
      },
    ];
  },
};

export default nextConfig;
