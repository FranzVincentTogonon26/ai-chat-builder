import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User fetch error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}