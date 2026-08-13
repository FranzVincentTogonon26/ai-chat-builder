import { db } from "@/db";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [metadataRecord] = await db
      .select()
      .from(metadata)
      .where(eq(metadata.user_email, user.email));

    const organizations = {
      ...(metadataRecord || []),
      id: user.organization_id,
    };

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Failed to process chat request:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
