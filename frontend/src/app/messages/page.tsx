import { redirect } from "next/navigation";
import { getSessionUser } from "@/services/authService";
import Header from "@/components/organisms/Header/Header";

export default async function MessagesPage() {
  if (!await getSessionUser()) redirect("/login?next=%2Fmessages");
  return <><Header /><main><h1>Messagerie</h1><p>Messagerie à développer.</p></main></>;
}
