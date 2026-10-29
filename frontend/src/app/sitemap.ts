import type { MetadataRoute } from "next";
import { getProperties } from "@/services/propertyService";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.SITE_URL || "http://localhost:3001";
  const base = origin.replace(/\/$/, "");
  const properties = await getProperties();

  return [
    { url: base + "/" },
    { url: base + "/about" },
    ...properties.map((property) => ({
      url: base + "/properties/" + encodeURIComponent(property.id),
    })),
  ];
}
