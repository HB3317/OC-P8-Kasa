import type { Metadata } from "next";
import LoginTemplate from "@/components/templates/LoginTemplate";

export const metadata: Metadata = {
  title: "Connexion | Kasa",
  description: "Connectez-vous à votre compte Kasa.",
};

export default function LoginPage() {
  return <LoginTemplate />;
}
