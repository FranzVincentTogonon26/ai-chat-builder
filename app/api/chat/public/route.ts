import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Missing session token" },
      { status: 401 },
    );
  }

  let sessionId: string | undefined;
  let widgetId: string | undefined;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    sessionId = payload.sessionId as string;
    widgetId = payload.widgetId as string;

    if (!sessionId || !widgetId) {
      throw new Error("Invalid session token");
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      { error: "Invalid or expired session token" },
      { status: 401 },
    );
  }

  let { messages, knowledge_source_ids } = await req.json()
  const lastMessage = messages[messages.length - 1]

  if(!lastMessage || lastMessage.role !== "user"){
    console.log("No new user message detected or invalid format")
  }

  try {
    
  } catch (error) {
    
  }
}
