import { db } from "@/db";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  const metadataResponse = await db.insert(metadata).values({
    user_email: user.email,
    business_name,
    industry,
    description,
  });

  (await cookies()).set("metadata", JSON.stringify({ business_name }));

  return NextResponse.json({ metadataResponse }, { status: 201 });
}
