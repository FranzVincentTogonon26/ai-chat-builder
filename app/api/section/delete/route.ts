import { db } from "@/db";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body as { id?: string };

    if (!id) {
      return NextResponse.json(
        { error: "Missing section id." },
        { status: 400 },
      );
    }

    const result = await db
      .delete(sections)
      .where(and(eq(sections.id, id), eq(sections.user_email, user.email)));

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section." },
      { status: 500 },
    );
  }
}