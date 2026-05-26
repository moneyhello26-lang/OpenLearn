// app/api/ai/analyze/route.ts
import { analyzeContent } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface AnalyzeRequest {
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length < 5) {
      return NextResponse.json(
        { error: "Content must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content must be less than 5000 characters" },
        { status: 400 }
      );
    }

    const analysis = await analyzeContent(content);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing content:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
