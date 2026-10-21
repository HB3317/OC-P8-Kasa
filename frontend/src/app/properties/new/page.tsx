import { redirect } from "next/navigation";
import { getSessionUser } from "@/services/authService";
import Header from "@/components/organisms/Header/Header";

export default async function NewPropertyPage() {
  if (!await getSessionUser()) redirect("/login?next=%2Fproperties%2Fnew");
  return <><Header /><main><h1>Ajouter un logement</h1><p>Formulaire de publication à développer.</p></main></>;
}
