import { db } from "@/db";
import { team_members } from "@/db/schema";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    const secret = process.env.SCALEKIT_WEBHOOK_KEY!;

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 },
      );
    }

    const isValid = scalekit.verifyWebhookPayload(secret, headers, body);

    if (!isValid) {
      console.error("Webhook verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    switch (event.type) {
      case "user.organization_membership_created":
        const param = event.data;
        await db
          .update(team_members)
          .set({ status: "active" })
          .where(eq(team_members.user_email, param.user.email));
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhooks processing error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
