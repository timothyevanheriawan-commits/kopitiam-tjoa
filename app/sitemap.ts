// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://kopitiamtjoa.id"; // TODO: set real production domain

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      changeFrequency: "weekly", // availability/prices change more often than the rest of the site
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // /order/[id] and /admin/* are intentionally excluded — per-customer
    // tracking links and the staff dashboard have no reason to be indexed.
  ];
}
