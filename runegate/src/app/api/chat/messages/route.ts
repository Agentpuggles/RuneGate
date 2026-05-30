import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel") || "lobby";
    const after = searchParams.get("after");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const where: any = { channel: { name: channel } };
    if (after) {
      where.id = { gt: after };
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatar: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
