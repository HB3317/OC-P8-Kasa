import { redirect } from "next/navigation";
import { getSessionUser } from "@/services/authService";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import MessagesInbox from "@/components/organisms/MessagesInbox/MessagesInbox";
export const dynamic = "force-dynamic";
export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fmessages");
  return <><Header /><main><MessagesInbox userId={user.id} /></main><Footer /></>;
}
