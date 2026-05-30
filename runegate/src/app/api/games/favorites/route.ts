import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gameId, action } = await req.json();
    if (!gameId || !action) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    if (action === "add") {
      await prisma.favorite.upsert({
        where: { userId_gameId: { userId: user.id, gameId } },
        update: {},
        create: { userId: user.id, gameId },
      });
    } else if (action === "remove") {
      await prisma.favorite.deleteMany({
        where: { userId: user.id, gameId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorite error:", error);
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
