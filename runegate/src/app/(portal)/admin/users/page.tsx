import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersAdminClient from "./UsersAdminClient";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session.isLoggedIn || session.username !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all users from the Prisma database
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      displayName: true,
      title: true,
      rank: true,
      level: true,
      xp: true,
      gold: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      profileImage: true,
      bio: true,
    },
  });
  await prisma.$disconnect();

  return <UsersAdminClient users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString(), lastLogin: u.lastLogin.toISOString() }))} />;
}
