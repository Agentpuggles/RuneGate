import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const games = await prisma.game.findMany({ where: { active: true }, orderBy: { plays: "desc" } });
    const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, select: { gameId: true } });
    const favoriteIds = new Set(favorites.map((f) => f.gameId));

    const recentSessions = await prisma.gameSession.findMany({
      where: { userId: user.id }, orderBy: { playedAt: "desc" }, take: 10, select: { gameId: true },
    });
    const recentGameIds = [...new Set(recentSessions.map((s) => s.gameId))];

    return NextResponse.json({
      games: games.map((g) => ({ ...g, isFavorite: favoriteIds.has(g.id) })),
      favoriteIds: [...favoriteIds],
      recentGameIds,
    });
  } catch (error) {
    console.error("Games error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
