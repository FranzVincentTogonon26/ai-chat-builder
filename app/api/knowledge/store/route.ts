import { db } from "@/db";
import { knowledge } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 500;

const VALID_TYPES = new Set(["website", "docs", "text", "upload"]);

type SourceType = "website" | "docs" | "text" | "upload";

interface ImportData {
  type?: string;
  url?: string;
  title?: string;
  content?: string;
}

interface SourceMetadata {
  filename?: string;
  fileSize?: number;
  rowCount?: number;
}

const errorResponse = (message: string, status: number): NextResponse => {
  return NextResponse.json({ error: message }, { status });
};

const isValidSourceType = (type: string): type is SourceType => {
  return VALID_TYPES.has(type);
};

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const crawlWebsite = async (url: string): Promise<string> => {
  const apiKey = process.env.ZENROWS_API_KEY;

  if (!apiKey) {
    throw new Error("ZENROWS_API_KEY is not configured");
  }

  const zenUrl = new URL("https://api.zenrows.com/v1/");

  zenUrl.searchParams.set("apikey", apiKey);
  zenUrl.searchParams.set("url", url);
  zenUrl.searchParams.set("response_type", "markdown");

  const response = await fetch(zenUrl.toString(), {
    headers: {
      "User-Agent": "Chatbot Knowledge Base Crawler",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to crawl website");
  }

  const content = await response.text();

  if (!content.trim()) {
    throw new Error("No content extracted from URL");
  }

  return content;
};

const summarizeContent = async (content: string): Promise<string> => {
  if (!content.trim()) {
    return content;
  }

  const summarized = await summarizeMarkdown(content);

  return summarized?.trim() || content;
};

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const contentType = req.headers.get("content-type") ?? "";

    let type = "";
    let name = "";
    let sourceUrl: string | null = null;
    let content = "";
    let metadata: SourceMetadata = {};

    /*
     * Handle multipart/form-data uploads
     */
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      type = String(formData.get("type") ?? "").trim();

      const file = formData.get("file");

      if (!(file instanceof File)) {
        return errorResponse("No file provided", 400);
      }

      if (file.size > MAX_FILE_SIZE) {
        return errorResponse("File size must be less than 10MB", 413);
      }

      name = file.name;
      content = await file.text();

      metadata = {
        filename: file.name,
        fileSize: file.size,
      };
    } else {
      /*
       * Handle JSON requests
       */
      const body = (await req.json()) as ImportData;

      type = body.type?.trim() ?? "";

      if (type === "website") {
        sourceUrl = body.url?.trim() ?? null;

        if (!sourceUrl || !isValidUrl(sourceUrl)) {
          return errorResponse("Invalid URL provided", 400);
        }

        name = new URL(sourceUrl).hostname;
      }

      if (type === "text" || type === "docs") {
        content = body.content?.trim() ?? "";
        name = body.title?.trim() || "Text source";
      }
    }

    /*
     * Validate source type
     */
    if (!isValidSourceType(type)) {
      return errorResponse("Invalid source type", 400);
    }

    /*
     * Crawl website
     */
    if (type === "website") {
      if (!sourceUrl) {
        return errorResponse("Website URL is required", 400);
      }

      content = await crawlWebsite(sourceUrl);
    }

    /*
     * Validate content
     */
    if (type === "text" || type === "docs" || type === "upload") {
      if (!content.trim()) {
        return errorResponse("No content provided", 400);
      }
    }

    /*
     * Validate uploaded source
     */
    if (type === "upload" && !metadata.filename) {
      return errorResponse("Invalid upload", 400);
    }

    /*
     * Summarize larger content
     */
    if (content.length > MAX_TEXT_LENGTH) {
      content = await summarizeContent(content);
    }

    /*
     * Store knowledge source
     */
    await db.insert(knowledge).values({
      user_email: user.email,
      type,
      name,
      status: "active",
      source_url: sourceUrl,
      content: content.trim() || null,
      meta_data: JSON.stringify(metadata),
    });

    return NextResponse.json(
      {
        message: "Source added successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Knowledge store error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    if (message === "ZENROWS_API_KEY is not configured") {
      return errorResponse(message, 500);
    }

    if (
      message === "Failed to crawl website" ||
      message === "No content extracted from URL"
    ) {
      return errorResponse(message, 502);
    }

    return errorResponse("Internal Server Error", 500);
  }
}
