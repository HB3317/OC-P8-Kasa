import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import { redirect } from "next/navigation";
import { getSessionUser } from "@/services/authService";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import MessagesTemplate from "@/components/templates/MessagesTemplate";
export const dynamic = "force-dynamic";
export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fmessages");
  return <><Header /><main><MessagesTemplate userId={user.id} /></main><Footer /></>;
}
