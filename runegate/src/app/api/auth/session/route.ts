import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }
    return NextResponse.json({ isLoggedIn: true, user });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
