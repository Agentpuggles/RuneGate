import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const game = await prisma.game.findUnique({ where: { id: params.id } });
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    // Check if favorite
    const favorite = await prisma.favorite.findFirst({
      where: { userId: user.id, gameId: game.id },
    });

    // Record play session
    await prisma.gameSession.create({
      data: { userId: user.id, gameId: game.id },
    });

    // Increment play count
    await prisma.game.update({
      where: { id: game.id },
      data: { plays: { increment: 1 } },
    });

    return NextResponse.json({
      ...game,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Game fetch error:", error);
    return NextResponse.json({ error: "Failed to load game" }, { status: 500 });
  }
}
