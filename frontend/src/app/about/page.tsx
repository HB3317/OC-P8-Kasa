import type { Metadata } from "next";
import AboutTemplate from "@/components/templates/AboutTemplate";

export const metadata: Metadata = {
  title: "À propos | Kasa",
  description: "Découvrez la mission et les engagements de Kasa.",
};

export default function AboutPage() {
  return <AboutTemplate />;
}
