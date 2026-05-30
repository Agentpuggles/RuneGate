import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GamesClient from "./GamesClient";

export default async function GamesPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  return <GamesClient />;
}
