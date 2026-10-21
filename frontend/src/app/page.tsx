import type { Metadata } from "next";
import { redirect } from "next/navigation";
import HomeTemplate from "@/components/templates/HomeTemplate";
import { getSessionUser } from "@/services/authService";
import { getProperties } from "@/services/propertyService";

export const metadata: Metadata = {
  title: "Accueil | Kasa",
  description: "Découvrez les logements disponibles sur Kasa.",
};

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const properties = await getProperties();

  return <HomeTemplate properties={properties} />;
}
