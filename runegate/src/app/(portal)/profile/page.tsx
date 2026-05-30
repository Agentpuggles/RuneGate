import { getUser, getUserStats } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const stats = await getUserStats(user.id);
  return <ProfileClient user={user} stats={stats} />;
}
