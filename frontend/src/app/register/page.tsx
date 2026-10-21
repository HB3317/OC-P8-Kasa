import type { Metadata } from "next";
import RegisterTemplate from "@/components/templates/RegisterTemplate";

export const metadata: Metadata = {
  title: "Inscription | Kasa",
  description: "Créez votre compte sur Kasa.",
};

export default function RegisterPage() {
  return <RegisterTemplate />;
}
