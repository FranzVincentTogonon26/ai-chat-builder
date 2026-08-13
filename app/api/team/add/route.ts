import { db } from "@/db";
import { team_members } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import scalekit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const isLoggedInUser = await isAuthorized();
    if (!isLoggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const pendingTeamMember = await db
      .select()
      .from(team_members)
      .where(eq(team_members.user_email, email));

    if (pendingTeamMember.length > 0) {
      return NextResponse.json(
        { error: "User is already invited" },
        { status: 400 },
      );
    }

    const { user } = await scalekit.user.createUserAndMembership(
      isLoggedInUser.organization_id,
      {
        email,
        userProfile: {
          firstName: name || email.split("@")[0],
          lastName: "",
        },
        sendInvitationEmail: true,
      },
    );

    await db.insert(team_members).values({
      user_email: email,
      name: name || email.split("@")[0],
      organization_id: isLoggedInUser.organization_id,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to add team members", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
