import { db } from "@/db";
import { knowledge } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources = await db
      .select()
      .from(knowledge)
      .where(eq(knowledge.user_email, user.email))
      .orderBy(desc(knowledge.created_at));

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Knowledge fetch error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}