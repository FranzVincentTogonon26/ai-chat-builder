import { db } from "@/db";
import { knowledge } from "@/db/schema";
import { countConversationToken } from "@/lib/countConversationTokens";
import { summarizeConversation, systemRoleContext } from "@/lib/gemini";
import { isAuthorized } from "@/lib/isAuthorized";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: {
      messages?: { role: string; content: string }[];
      knowledge_source_ids?: string[];
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    let messages = Array.isArray(body.messages) ? body.messages : [];
    const knowledgeSourceIds = Array.isArray(body.knowledge_source_ids)
      ? body.knowledge_source_ids
      : [];
    let context = "";

    if (knowledgeSourceIds.length > 0) {
      const sources = await db
        .select({ content: knowledge.content })
        .from(knowledge)
        .where(inArray(knowledge.id, knowledgeSourceIds));

      context = sources
        .map((s) => s.content)
        .filter(Boolean)
        .join("\n\n");
    }

    const tokenCount = countConversationToken(messages);

    if (tokenCount > 6000) {
      const recentMessages = messages.slice(-10);
      const olderMessages = messages.slice(0, -10);

      if (olderMessages.length > 0) {
        const summary = await summarizeConversation(olderMessages);

        context = `PREVIOUS CONVERSATION SUMMARY:\n ${summary} \n\n` + context;
        messages = recentMessages;
      }
    }

    const reply = await systemRoleContext(context, messages);

    return NextResponse.json({
      response: reply || "I'm sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Failed to process chat request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
