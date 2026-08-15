import { db } from "@/db";
import { conversation, knowledge } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { messages as messagesTable } from "@/db/schema";
import { countConversationToken } from "@/lib/countConversationTokens";
import { summarizeConversation, systemRoleContext } from "@/lib/gemini";
import type { ChatMessage } from "@/lib/gemini";

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

  let messages: ChatMessage[] = [];
  let knowledge_source_ids: string[] = [];

  try {
    const body = await req.json();
    messages = (body.messages ?? []).filter(
      (m: ChatMessage) => m && typeof m.content === "string" && m.content.trim() !== "",
    );
    knowledge_source_ids = body.knowledge_source_ids ?? [];
  } catch (error) {
    console.error("Invalid request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user") {
    return NextResponse.json(
      { error: "No new user message detected or invalid format" },
      { status: 400 },
    );
  }

  try {
    const [existingConversation] = await db
      .select()
      .from(conversation)
      .where(eq(conversation.id, sessionId))
      .limit(1);

    if (!existingConversation) {
      const forwardedFor = req.headers.get("x-forwarded-for");
      const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";
      const visitorName = `#Visitor (${ip})`;

      await db.insert(conversation).values({
        id: sessionId,
        chatbot_id: widgetId,
        visitor_ip: ip,
        name: visitorName,
      });

      const previousMessages = messages.slice(0, -1);
      if (previousMessages.length > 0) {
        for (const msg of previousMessages) {
          await db.insert(messagesTable).values({
            conversation_id: sessionId,
            role: msg.role,
            content: msg.content,
          });
        }
      }
    }

    if (lastMessage.role === "user") {
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "user",
        content: lastMessage.content,
      });
    }
  } catch (error) {
    console.error("Database Persistence Error (User):", error);
  }

  let context = "";
  if (knowledge_source_ids.length > 0) {
    try {
      const sources = await db
        .select({ content: knowledge.content })
        .from(knowledge)
        .where(inArray(knowledge.id, knowledge_source_ids));

      context = sources
        .map((s) => s.content)
        .filter(Boolean)
        .join("\n\n");
    } catch (err) {
      console.error("RAG Retrieval Error:", err);
    }
  }

  const tokenCount = countConversationToken(messages);
  if (tokenCount > 6000) {
    const recentMessages = messages.slice(-10);
    const olderMessages = messages.slice(0, -10);

    if (olderMessages.length > 0) {
      const summary = await summarizeConversation(olderMessages);

      context = `PREVIOUS CONVERSATION SUMMARY: \n${summary}\n\n` + context;
      messages = recentMessages;
    }
  }

  let reply: string;

  try {
    reply = await systemRoleContext(context, messages);
  } catch (error) {
    console.error("AI response generation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "AI service unavailable",
      },
      { status: 503 },
    );
  }

  const finalReply = reply || "I'm sorry, I couldn't generate a response.";

  try {
    await db.insert(messagesTable).values({
      conversation_id: sessionId,
      role: "assistant",
      content: finalReply,
    });
  } catch (error) {
    console.error("Database Persistence Error (Assistant):", error);
  }

  return NextResponse.json({ response: finalReply });
}
