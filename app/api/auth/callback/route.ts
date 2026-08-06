import scalekit from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

interface IdTokenClaims {
  organization_id?: string;
  org_id?: string;
  oid?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error)
    return NextResponse.json({ error, error_description }, { status: 401 });
  if (!code)
    return NextResponse.json({ error: "No code provided" }, { status: 400 });

  try {
    const redirectUri = process.env.SCALEKIT_REDIRECT_URI!;
    const { user, idToken } = await scalekit.authenticateWithCode(
      code,
      redirectUri,
    );
    const claims = await scalekit.validateToken<IdTokenClaims>(idToken);
    const organizationId =
      claims.organization_id ?? claims.org_id ?? claims.oid ?? null;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Np organiztion id found in token claims" },
        { status: 500 },
      );
    }

    return NextResponse.json({ user, organizationId });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed", detail: String(error) },
      { status: 500 },
    );
  }
}
