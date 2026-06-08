
import { generateChatResponse, cleanAIResponse } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  model?: "gemma-4-26b-a4b-it" | "gemini-pro-latest" | "gemini-flash-latest";
  temperature?: number;
  maxTokens?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    const {
      messages,
      model = "gemma-4-26b-a4b-it",
      temperature = 0.7,
      maxTokens = 8192,
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    const validMessages = messages.every(
      (msg) =>
        msg.role && (msg.role === "user" || msg.role === "assistant") && msg.content
    );

    if (!validMessages) {
      return NextResponse.json(
        { error: "Invalid message format. Each message must have role and content." },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(messages, model, {
      temperature,
      maxTokens,
    });

    return NextResponse.json({
      success: true,
      message: cleanAIResponse(response),
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
