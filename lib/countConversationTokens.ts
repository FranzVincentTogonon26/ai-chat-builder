import { getEncoding } from "js-tiktoken";
import type { ChatMessage } from "@/lib/gemini";

const encoded = getEncoding("cl100k_base");

export function countTokens(text: string): number {
  return encoded.encode(text).length;
}

export function countConversationToken(messages: ChatMessage[]) {
  let tokens = 0;

  for (const msg of messages) {
    tokens += 4;
    tokens += encoded.encode(msg.content).length;
  }

  tokens += 2;
  return tokens;
}