import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import MusicClient from "./MusicClient";

export default async function MusicPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  return <MusicClient />;
}
