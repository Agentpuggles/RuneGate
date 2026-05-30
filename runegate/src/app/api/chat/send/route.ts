import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, channelName } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 chars)" }, { status: 400 });
    }

    // Find channel
    const channel = await prisma.channel.findUnique({
      where: { name: channelName || "lobby" },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        channelId: channel.id,
        userId: user.id,
        content: content.trim(),
        type: "message",
      },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
