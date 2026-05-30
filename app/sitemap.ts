import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";
import { getAllCategorySlugs } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/manufacturing",
    "/certifications",
    "/private-label",
    "/contact",
    "/faq",
  ];

  const categoryRoutes = getAllCategorySlugs().map(
    (slug) => `/products/${slug}`,
  );

  return [...staticRoutes, ...categoryRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/products/") ? 0.8 : 0.7,
  }));
}
