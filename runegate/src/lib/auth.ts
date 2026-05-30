import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import prisma from "./db";

export interface SessionData {
  userId: string;
  username: string;
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || "runegate-super-secret-key-change-in-production-rune-gate-32chars",
  cookieName: process.env.SESSION_COOKIE_NAME || "runegate_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getUser() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      profileImage: true,
      bio: true,
      title: true,
      rank: true,
      level: true,
      xp: true,
      gold: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  return user;
}

export async function getUserStats(userId: string) {
  const [gamesPlayed, messagesSent, searchesMade, favoriteCount, noteCount] = await Promise.all([
    prisma.gameSession.count({ where: { userId } }),
    prisma.message.count({ where: { userId, type: "message" } }),
    prisma.searchLog.count({ where: { userId } }),
    prisma.favorite.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
  ]);

  return { gamesPlayed, messagesSent, searchesMade, favoriteCount, noteCount };
}
