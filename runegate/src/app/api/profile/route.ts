import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const stats = await (await import("@/lib/auth")).getUserStats(user.id);
    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, avatar, displayName, bio, profileImage } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = String(title).substring(0, 100);
    if (avatar !== undefined) updateData.avatar = String(avatar).substring(0, 50);
    if (displayName !== undefined) updateData.displayName = displayName ? String(displayName).substring(0, 50) : null;
    if (bio !== undefined) updateData.bio = String(bio).substring(0, 300);
    if (profileImage !== undefined) updateData.profileImage = profileImage ? String(profileImage).substring(0, 500) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
