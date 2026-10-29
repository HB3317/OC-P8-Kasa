import type { Metadata } from "next";
import NotFoundTemplate from "@/components/templates/NotFoundTemplate";

export const metadata: Metadata = {
  title: "Page introuvable | Kasa",
  description: "La page demandée est introuvable. Retrouvez les logements Kasa.",
};

export default function NotFoundPage() {
  return <NotFoundTemplate />;
}
