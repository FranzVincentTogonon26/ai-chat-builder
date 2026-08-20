import { db } from "@/db";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { business_name, industry, description } = await req.json();
    if (!business_name || !industry) {
      return NextResponse.json(
        { error: "Missing business name and industry" },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select({ id: metadata.id })
      .from(metadata)
      .where(eq(metadata.user_email, user.email))
      .limit(1);

    let response;
    let status = 201;

    if (existing) {
      response = await db
        .update(metadata)
        .set({ business_name, industry, description })
        .where(eq(metadata.id, existing.id));
      status = 200;
    } else {
      response = await db.insert(metadata).values({
        user_email: user.email,
        business_name,
        industry,
        description,
      });
    }

    (await cookies()).set("metadata", JSON.stringify({ business_name }));

    return NextResponse.json({ metadataResponse: response }, { status });
  } catch (error) {
    console.error("Metadata store error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}