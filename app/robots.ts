// app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://kopitiamtjoa.id"; // TODO: set real production domain — keep in sync with app/sitemap.ts

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/order/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
