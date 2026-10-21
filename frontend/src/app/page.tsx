import type { Metadata } from "next";
import HomeTemplate from "@/components/templates/HomeTemplate";
import { getProperties } from "@/services/propertyService";

export const metadata: Metadata = {
  title: "Accueil | Kasa",
  description: "Découvrez les logements disponibles sur Kasa.",
};

export default async function HomePage() {
  const properties = await getProperties();

  return <HomeTemplate properties={properties} />;
}
