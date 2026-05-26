// app/api/ai/simple/route.ts
import { generateAIResponse } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface SimpleRequest {
  prompt: string;
  model?: "gemma-4-26b-a4b-it" | "gemini-pro-latest" | "gemini-flash-latest";
  temperature?: number;
  maxTokens?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SimpleRequest = await request.json();

    const { prompt, model = "gemma-4-26b-a4b-it", temperature = 0.7, maxTokens = 2048 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length < 1) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      );
    }

    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: "Prompt must be less than 10000 characters" },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(prompt, model, {
      temperature,
      maxTokens,
    });

    return NextResponse.json({
      success: true,
      prompt,
      response,
    });
  } catch (error) {
    console.error("Error in simple AI request:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
