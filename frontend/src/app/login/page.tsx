import type { Metadata } from "next";
import LoginTemplate from "@/components/templates/LoginTemplate";

export const metadata: Metadata = {
  title: "Connexion | Kasa",
  description: "Connectez-vous à votre compte Kasa.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <LoginTemplate nextPath={next} />;
}
