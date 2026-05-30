import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gameId, score } = await req.json();
    if (!gameId || typeof score !== "number") {
      return NextResponse.json({ error: "gameId and score required" }, { status: 400 });
    }

    // Check if this is a new high score
    const existing = await prisma.scoreEntry.findFirst({
      where: { userId: user.id, gameId },
      orderBy: { score: "desc" },
    });

    if (!existing || score > existing.score) {
      await prisma.scoreEntry.create({
        data: { userId: user.id, gameId, score },
      });
      return NextResponse.json({ success: true, newHighScore: true, score });
    }

    return NextResponse.json({ success: true, newHighScore: false, score });
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
