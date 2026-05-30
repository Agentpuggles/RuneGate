import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isLoggedIn || session.username !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const data = await req.json();

  const user = await prisma.user.update({
    where: { id },
    data: {
      displayName: data.displayName,
      title: data.title,
      rank: data.rank,
      level: data.level,
      xp: data.xp,
      gold: data.gold,
    },
  });

  return NextResponse.json({ user });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isLoggedIn || session.username !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Prevent deleting admin
  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.username === "admin") {
    return NextResponse.json({ error: "Cannot delete admin user" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
