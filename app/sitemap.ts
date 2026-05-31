import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";
import { getAllCategorySlugs } from "@/lib/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const slugs = await getAllCategorySlugs();
  const categoryRoutes = slugs.map((slug) => `/products/${slug}`);

  return [...staticRoutes, ...categoryRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/products/") ? 0.8 : 0.7,
  }));
}
