import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  return <LeaderboardClient />;
}
