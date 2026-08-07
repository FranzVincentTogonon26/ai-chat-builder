import { isAuthrized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await isAuthrized();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { businessName, industry, description } = await req.json();
  if (!businessName || !industry) {
    return NextResponse.json(
      { error: "Missing business name and industry" },
      { status: 400 },
    );
  }
}
