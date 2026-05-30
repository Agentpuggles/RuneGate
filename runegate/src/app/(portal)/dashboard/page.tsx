import { getUser, getUserStats } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const stats = await getUserStats(user.id);
  return <DashboardClient user={user} stats={stats} />;
}
