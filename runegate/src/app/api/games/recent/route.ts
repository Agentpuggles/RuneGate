import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recent = await prisma.gameSession.findMany({
      where: { userId: user.id },
      orderBy: { playedAt: "desc" },
      take: 20,
      include: { game: true },
    });

    // Deduplicate by game
    const seen = new Set<string>();
    const uniqueRecent = recent.filter((r) => {
      if (seen.has(r.gameId)) return false;
      seen.add(r.gameId);
      return true;
    });

    return NextResponse.json({ recent: uniqueRecent.map((r) => r.game) });
  } catch (error) {
    console.error("Recent games error:", error);
    return NextResponse.json({ error: "Failed to fetch recent" }, { status: 500 });
  }
}
