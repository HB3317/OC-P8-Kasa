import type { Metadata } from "next";
import RegisterTemplate from "@/components/templates/RegisterTemplate";

export const metadata: Metadata = {
  title: "Inscription | Kasa",
  description: "Créez votre compte sur Kasa.",
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <RegisterTemplate nextPath={next} />;
}
