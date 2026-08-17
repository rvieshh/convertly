import type { MetadataRoute } from "next";
import { allConverterSlugs } from "@/lib/converterPages";
import { allCategorySlugs } from "@/lib/categories";

// Adjust to the production origin when deploying.
const BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://convertly.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];
  // Category pages rank highest after the homepage.
  for (const slug of allCategorySlugs()) {
    routes.push({ url: `${BASE}/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
  }
  for (const slug of allConverterSlugs()) {
    routes.push({
      url: `${BASE}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: slug.includes("-to-") ? 0.8 : 0.6,
    });
  }
  return routes;
}
