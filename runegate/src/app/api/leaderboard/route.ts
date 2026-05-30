import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");

    if (gameId) {
      // Leaderboard for specific game
      const scores = await prisma.scoreEntry.findMany({
        where: { gameId },
        orderBy: { score: "desc" },
        take: 20,
        include: {
          user: { select: { username: true, displayName: true, avatar: true } },
          game: { select: { title: true, slug: true } },
        },
      });

      // Get unique best scores per user
      const bestScores = new Map<string, typeof scores[0]>();
      for (const s of scores) {
        if (!bestScores.has(s.userId)) bestScores.set(s.userId, s);
      }

      return NextResponse.json({ leaderboard: [...bestScores.values()] });
    }

    // Global leaderboard — total scores across all games
    const games = await prisma.game.findMany({ where: { active: true } });
    const gameLeaderboards: Record<string, any[]> = {};

    for (const game of games) {
      const topScores = await prisma.scoreEntry.findMany({
        where: { gameId: game.id },
        orderBy: { score: "desc" },
        take: 5,
        include: { user: { select: { username: true, displayName: true, avatar: true } } },
      });

      // Deduplicate by user (keep best)
      const best = new Map<string, typeof topScores[0]>();
      for (const s of topScores) {
        if (!best.has(s.userId)) best.set(s.userId, s);
      }

      if (best.size > 0) {
        gameLeaderboards[game.id] = [...best.values()].map((s, i) => ({
          rank: i + 1,
          username: s.user.displayName || s.user.username,
          avatar: s.user.avatar,
          score: s.score,
          date: s.createdAt,
        }));
      }
    }

    // Most played games
    const mostPlayed = await prisma.gameSession.groupBy({
      by: ["gameId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const gameIds = mostPlayed.map((mp) => mp.gameId);
    const gameData = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, title: true, slug: true, thumbnail: true, image: true, category: true },
    });

    const playedWithGames = mostPlayed.map((mp) => ({
      ...gameData.find((g) => g.id === mp.gameId),
      playCount: mp._count.id,
    }));

    return NextResponse.json({ gameLeaderboards, mostPlayed: playedWithGames });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
