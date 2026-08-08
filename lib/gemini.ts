import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey,
    });
  }

  return client;
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("status" in error) {
    const status = Number(error.status);

    return Number.isNaN(status) ? undefined : status;
  }

  return undefined;
};

const runPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error: unknown) {
    console.error("Gemini request failed:", error);

    const status = getErrorStatus(error);

    switch (status) {
      case 400:
        throw new Error("Invalid Gemini request.");

      case 401:
        throw new Error("Invalid Gemini API key.");

      case 403:
        throw new Error("Gemini API access denied.");

      case 429:
        throw new Error("Gemini quota exceeded.");

      default:
        throw new Error(
          "The AI service is temporarily unavailable. Please try again.",
        );
    }
  }
};

export async function summarizeMarkdown(markdown: string): Promise<string> {
  const content = markdown.trim();

  if (!content) {
    throw new Error("Markdown content cannot be empty.");
  }

  const prompt = `
    You are a data summarization engine for an AI chatbot.

    Your task is to convert website markdown, text, or CSV data into a clean, dense summary optimized for LLM context usage.

    STRICT RULES:

    - Output ONLY plain text.
    - Do NOT use markdown.
    - Do NOT use bullet points.
    - Do NOT use headings.
    - Write the result as ONE continuous paragraph.
    - Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
    - Remove repetition and marketing language.
    - Keep ONLY factual and informational content that can help answer customer support questions.
    - Preserve important business information, products, services, policies, pricing information, contact information, requirements, limitations, and procedures when relevant.
    - Do NOT copy sentences verbatim unless absolutely necessary.
    - Compress aggressively while preserving meaning.
    - Do NOT invent, assume, or infer information that is not present in the source.
    - Preserve important numbers, names, dates, URLs, policies, requirements, and limitations.
    - The final output MUST be under 2000 words.

    The result will be stored as long-term context for a chatbot.

    SOURCE DATA:

    ${content}
    `;

  return runPrompt(prompt);
}
