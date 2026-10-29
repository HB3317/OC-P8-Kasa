import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty } from "@/services/propertyService";
import PropertyDetailTemplate from "@/components/templates/PropertyDetailTemplate";

type PropertyParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PropertyParams): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Logement introuvable | Kasa", robots: { index: false } };

  const description = property.description?.trim() ||
    `Découvrez ${property.title} sur Kasa : photos, équipements et informations sur le logement.`;
  return {
    title: `${property.title} | Kasa`,
    description: description.slice(0, 160),
    alternates: { canonical: `/properties/${encodeURIComponent(property.id)}` },
  };
}


/** Les URL relatives d'images doivent être absolues dans les données structurées. */
function imageUrl(source: string, origin: string): string | null {
  const value = source.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  const imagePath = value.startsWith("/uploads/")
    ? "/api/property-images/" + encodeURIComponent(value.slice("/uploads/".length))
    : value;
  return new URL(imagePath, origin).toString();
}

/** Empêche qu'une description ferme la balise script JSON-LD. */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const origin = (process.env.SITE_URL || "http://localhost:3001").replace(/\/$/, "");
  const pictures = [property.cover, ...property.pictures]
    .filter((picture): picture is string => Boolean(picture))
    .map((picture) => imageUrl(picture, origin))
    .filter((picture): picture is string => picture !== null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "@id": origin + "/properties/" + encodeURIComponent(property.id),
    name: property.title,
    url: origin + "/properties/" + encodeURIComponent(property.id),
    ...(property.description ? { description: property.description } : {}),
    ...(pictures.length ? { image: [...new Set(pictures)] } : {}),
    ...(property.equipments.length
      ? { amenityFeature: property.equipments.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })) }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <PropertyDetailTemplate property={property} />
    </>
  );
}
