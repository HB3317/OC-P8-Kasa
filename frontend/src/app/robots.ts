import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.SITE_URL || "http://localhost:3001";
  const base = origin.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/messages", "/favorites", "/login", "/register", "/properties/new"],
    },
    sitemap: base + "/sitemap.xml",
  };
}
