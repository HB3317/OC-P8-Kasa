import type { Metadata } from "next";
import SignInTemplate from "@/components/templates/SignInTemplate";

export const metadata: Metadata = {
  title: "Inscription | Kasa",
  description: "Créez votre compte sur Kasa.",
};

export default function SignInPage() {
  return <SignInTemplate />;
}
